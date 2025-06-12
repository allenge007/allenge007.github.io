import os
import re

# 辅助函数：从 Markdown 文件提取标题
def _get_page_title(abs_file_path, fallback_filename):
    title = ""
    try:
        with open(abs_file_path, 'r', encoding='utf-8') as f:
            content_start = f.read(2048) # 读取文件开头一部分用于查找元数据或H1标题
            # 尝试从 frontmatter (YAML格式) 中查找标题
            frontmatter_match = re.search(r"^---\s*\n(.*?\n)---\s*\n", content_start, re.DOTALL | re.MULTILINE)
            if frontmatter_match:
                frontmatter_str = frontmatter_match.group(1)
                title_match = re.search(r"^\s*title\s*:\s*(?:\"([^\"]*)\"|'([^']*)'|([^#\n]*?))\s*$", frontmatter_str, re.MULTILINE | re.IGNORECASE)
                if title_match:
                    title = title_match.group(1) or title_match.group(2) or title_match.group(3) # 双引号、单引号或无引号
                    if title:
                        title = title.strip()
            # 如果 frontmatter 中没有标题，则尝试查找第一个 H1 标题
            if not title:
                h1_match = re.search(r"^\s*#\s+([^\n]+)", content_start, re.MULTILINE)
                if h1_match:
                    title = h1_match.group(1).strip()
    except Exception:
        pass # 忽略读取标题时发生的错误，将使用备用文件名
    
    # 如果找不到标题，则使用处理过的文件名作为备用标题
    if not title:
        title = fallback_filename[:-3].replace("_", " ").replace("-", " ").title()
    return title

def define_env(env):
    """
    MkDocs Macros 插件的钩子函数，用于定义环境变量和宏。
    """

    # --- list_docs_as_tree 的递归辅助函数 ---
    def _build_tree_recursive(current_scan_dir_abs,          # 当前扫描的目录的绝对路径
                              initial_target_dir_abs,        # 用户最初请求的顶级目标目录
                              calling_page_dir_abs,          # 调用宏的页面的目录绝对路径（用于生成相对链接）
                              depth,                         # 当前递归深度（用于缩进）
                              exclude_initial_target_index_flag, # 是否排除顶级目标目录下的 index.md
                              files_first_flag,              # 是否文件优先于子目录列出
                              linked_dirs_abs_paths_set):    # 已通过其 index.md 链接的目录集合

        current_level_file_lines = []  # 存储当前级别文件的 Markdown 列表项
        current_level_dir_lines = []   # 存储当前级别子目录的 Markdown 列表项
        has_listable_content_at_this_level = False # 标记当前级别是否有可列出的内容

        try:
            # 获取并排序当前目录下的所有项目（文件和子目录）
            items = sorted(os.listdir(current_scan_dir_abs), key=lambda x: x.lower())
        except OSError:
            return [], False # 无法列出目录内容，返回空列表和无内容标记

        md_files_names = []    # 当前目录下的 Markdown 文件名列表
        sub_dir_names = []     # 当前目录下的子目录名列表
        for item_name in items:
            item_abs_path = os.path.join(current_scan_dir_abs, item_name)
            if os.path.isdir(item_abs_path):
                sub_dir_names.append(item_name)
            elif item_name.lower().endswith(".md"):
                md_files_names.append(item_name)

        # 1. 处理当前目录下的 Markdown 文件
        for md_filename in md_files_names:
            md_abs_path = os.path.join(current_scan_dir_abs, md_filename)

            # 特殊处理 index.md 文件
            if md_filename.lower() == "index.md":
                # 如果是顶级目标目录的 index.md 且设置了排除标记，则跳过
                if current_scan_dir_abs == initial_target_dir_abs and exclude_initial_target_index_flag:
                    continue
                # 如果当前目录已经通过其 index.md 被父级链接，则跳过此 index.md 文件
                if current_scan_dir_abs in linked_dirs_abs_paths_set:
                    continue
            
            # 生成指向此文件的相对链接和标题
            link_href = os.path.relpath(md_abs_path, calling_page_dir_abs).replace(os.sep, '/')
            title = _get_page_title(md_abs_path, md_filename)
            indent = "  " * depth # 根据深度计算缩进
            current_level_file_lines.append(f"{indent}- [{title}]({link_href})")
            has_listable_content_at_this_level = True

        # 2. 处理当前目录下的子目录
        for sub_dir_name in sub_dir_names:
            sub_dir_abs_path = os.path.join(current_scan_dir_abs, sub_dir_name)
            index_in_subdir_abs = os.path.join(sub_dir_abs_path, "index.md") # 子目录的 index.md 路径
            
            is_subdir_linkable_via_its_index = os.path.exists(index_in_subdir_abs) # 子目录是否可通过其 index.md 链接

            # 如果此子目录将通过其 index.md 链接，则在递归调用前将其添加到集合中
            # 这样，递归调用（即子目录自身处理时）就知道其 index.md 已被用于链接，不应再作为文件列出
            if is_subdir_linkable_via_its_index:
                # 只有当它之前没被加入时才加入 (通常不太可能，但作为保护)
                if sub_dir_abs_path not in linked_dirs_abs_paths_set:
                     linked_dirs_abs_paths_set.add(sub_dir_abs_path)
            
            # 递归调用以构建子目录的树
            sub_tree_lines, sub_dir_has_further_content = _build_tree_recursive(
                sub_dir_abs_path,
                initial_target_dir_abs, # 传递原始的顶级目标目录
                calling_page_dir_abs,
                depth + 1, # 增加深度
                False,     # exclude_initial_target_index_flag 仅对顶级目标有效
                files_first_flag,
                linked_dirs_abs_paths_set # 传递更新后的集合
            )

            # 如果子目录可链接或其下有更深层内容，则将其添加到树中
            if is_subdir_linkable_via_its_index or sub_dir_has_further_content:
                has_listable_content_at_this_level = True
                indent = "  " * depth
                dir_display_name = f"{sub_dir_name}/" # 目录名后加斜杠
                
                if is_subdir_linkable_via_its_index: # 如果子目录有 index.md，则链接到它
                    dir_link_target = os.path.relpath(index_in_subdir_abs, calling_page_dir_abs).replace(os.sep, '/')
                    current_level_dir_lines.append(f"{indent}- [{dir_display_name}]({dir_link_target})")
                else: # 子目录没有 index.md，但其下有内容，则加粗显示目录名
                    current_level_dir_lines.append(f"{indent}- **{dir_display_name}**")
                
                if sub_dir_has_further_content: # 如果递归调用确实返回了子树内容
                    current_level_dir_lines.extend(sub_tree_lines)
            # 如果子目录不可链接且其下无内容，则不列出，并且如果之前因为它可链接而加入了set，现在要考虑是否移除
            # （当前逻辑是：如果可链接就会被列出，所以这个else分支的移除逻辑可能不会被频繁触发）
            elif is_subdir_linkable_via_its_index: 
                # 如果它曾被标记为可链接但最终没有其他内容导致它被列出（理论上不应发生，因为可链接就会被列）
                # 为保险起见，如果它被加入了set但最终没被列出，则移除
                # 但实际上，只要 is_subdir_linkable_via_its_index 为true，上面的if就会满足
                pass # 保持在set中，因为它的index.md确实存在，即使没有其他内容，它本身也是一个目标

        # 根据 files_first_flag 组合文件列表和目录列表的顺序
        output_lines = []
        if files_first_flag:
            output_lines.extend(current_level_file_lines)
            output_lines.extend(current_level_dir_lines)
        else:
            output_lines.extend(current_level_dir_lines)
            output_lines.extend(current_level_file_lines)
            
        return output_lines, has_listable_content_at_this_level

    @env.macro
    def list_docs_as_tree(folder_path=None, exclude_self_index=True, files_first=False):
        """
        生成一个 Markdown 列表，表示 Markdown 文件的目录树结构。
        如果 folder_path 为 None，则默认为调用此宏的当前页面的目录。
        仅列出 .md 文件和包含 .md 文件（或可链接的 index.md）的目录。

        参数:
            folder_path (str, optional): 相对于 docs_dir 的路径。默认为当前页面的目录。
            exclude_self_index (bool): 如果为 True，则初始目标目录中的 'index.md' 
                                       将不会作为文件列出。
            files_first (bool): 如果为 True，则目录中的文件会列在其子目录之前。
        """
        try:
            docs_dir = env.conf['docs_dir'] # MkDocs 的文档根目录
            # 获取调用宏的页面的信息
            if not hasattr(env, 'page') or not hasattr(env.page, 'file') or not hasattr(env.page.file, 'abs_src_path'):
                return "错误：页面上下文不可用，无法确定当前目录。"
            
            calling_page_dir_abs = os.path.dirname(env.page.file.abs_src_path) # 调用宏的页面的目录绝对路径

            # 确定初始目标目录
            if folder_path is None: # 如果未指定 folder_path，则默认为当前文件所在目录
                initial_target_dir_abs = calling_page_dir_abs
                # 用于错误消息显示的路径（相对于 docs_dir）
                normalized_folder_path_for_display = os.path.relpath(initial_target_dir_abs, docs_dir)
                if normalized_folder_path_for_display == ".": # 如果当前页面在 docs_dir 根目录
                    normalized_folder_path_for_display = "[文档根目录]"
            else:
                normalized_folder_path_for_display = folder_path.strip(os.sep) if folder_path else ""
                initial_target_dir_abs = os.path.normpath(os.path.join(docs_dir, normalized_folder_path_for_display))

        except (AttributeError, KeyError) as e:
            return f"错误：宏配置或页面上下文错误: {e}"

        if not os.path.isdir(initial_target_dir_abs):
            return f"错误：目录 '{normalized_folder_path_for_display}' 未在 '{initial_target_dir_abs}' 找到。"

        # 此集合跟踪其 index.md 被用作目录本身链接的目录。
        # 它通过递归传递，以便子级知道不要重新列出它们自己的 index.md。
        linked_dirs_set = set() 
        
        # 调用递归函数开始构建树
        all_lines, has_any_content = _build_tree_recursive(
            current_scan_dir_abs=initial_target_dir_abs,
            initial_target_dir_abs=initial_target_dir_abs, # 将自身作为初始目标传递，用于排除逻辑
            calling_page_dir_abs=calling_page_dir_abs,
            depth=0, # 初始深度为0
            exclude_initial_target_index_flag=exclude_self_index,
            files_first_flag=files_first,
            linked_dirs_abs_paths_set=linked_dirs_set
        )

        if not has_any_content:
            return f"目录 '{normalized_folder_path_for_display}' 下暂无符合条件的 Markdown 文档或子目录。"
            
        return "\n".join(all_lines)