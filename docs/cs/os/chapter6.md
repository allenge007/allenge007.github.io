# 文件系统

!!! note "课程信息"
    本笔记根据陈亮老师《操作系统》课程第十二讲“文件系统”PPT整理而成，旨在帮助学习和复习文件系统相关概念。

    *   **主讲人**: 陈亮
    *   **单位**: 计算机学院
    *   **日期**: 2025-5

## 学习目标

*   理解文件系统的基本功能。
*   掌握文件系统提供的接口。
*   探讨文件系统设计中的权衡因素，包括访问方法、文件共享、文件加锁机制以及目录结构。
*   了解文件系统的保护机制。

## 一、文件基本概念

### 1.1 什么是文件？

操作系统对存储设备的物理属性进行抽象，定义出逻辑存储单位——**文件**。文件由操作系统负责映射到物理设备上。

*   文件是用户创建的数据集合（Data collections created by users）。
*   对用户而言，文件系统是操作系统最重要的组成部分之一（The File System is one of the most important parts of the OS to a user）。

### 1.2 文件逻辑结构

文件表现为一段**连续的逻辑地址空间**。

*   **文件类型**:
    *   **数据文件**:
        *   数值型 (Numeric)
        *   字符型 (Character)
        *   二进制型 (Binary)
    *   **程序文件**:
        *   源代码文件 (source file)
        *   可执行文件 (executable file)
*   文件的**内容**由其创建者定义。常见的有文本文件、源文件、可执行文件等。

### 1.3 文件属性

文件属性是描述文件特性的元数据，保存在目录结构中（通常在磁盘上）。

*   **名称 (Name)**: 人类可读的文件标识。
*   **标识符 (Identifier)**: 文件系统内部唯一的标签（通常是数字）。
*   **类型 (Type)**: 支持不同文件类型的系统需要此属性。
*   **位置 (Location)**: 指向文件在设备上存储位置的指针。
*   **大小 (Size)**: 文件当前的大小。
*   **保护 (Protection)**: 控制用户对文件的读、写、执行等权限。
*   **时间、日期和用户标识 (Time, date, and user identification)**: 用于保护、安全和使用情况监控。
*   **扩展属性**: 例如文件校验和 (file checksum) 等。

<!-- PPT Slide 10: Mac OS上的文件属性 (图片展示了Finder中文件的详细信息，如种类、大小、位置、创建修改时间、权限等) -->

## 二、文件操作

操作系统提供了一系列基本的文件操作：

1.  **创建 (Create)**: 创建一个新文件。
2.  **写入 (Write)**: 在文件的当前写指针位置写入数据。
3.  **读取 (Read)**: 从文件的当前读指针位置读取数据。
4.  **文件内重定位 (Reposition within file / seek)**: 移动文件读/写指针到指定位置。
5.  **删除 (Delete)**: 删除文件，释放其占用的空间。
6.  **截断 (Truncate)**: 清空文件内容，但保留文件本身，大小变为0。

!!! tip "核心操作"
    以上6个基本操作构成了文件操作的最小集合。

此外，还有两个重要的管理操作：

*   **打开 (Open)**:
    1.  在磁盘上的目录结构中搜索文件条目 `Fi`。
    2.  将该条目的内容加载到内存中（通常是打开文件表）。
*   **关闭 (Close)**:
    1.  将内存中关于文件 `Fi` 的条目内容（可能已更新）写回到磁盘上的目录结构中。
    2.  释放内存中占用的相关资源。

### 2.1 文件打开（Open）的管理

当文件被打开时，操作系统需要维护以下信息来管理：

*   **打开文件表 (Open-file table)**: 跟踪系统中所有打开的文件。通常分为进程级打开文件表和系统级打开文件表。
*   **文件指针 (File pointer)**: 每个打开文件的进程都有一个指针，指向下一次读/写操作的位置。
*   **文件打开计数 (File-open count)**: 记录一个文件被多少个进程打开。当最后一个进程关闭该文件时，相关条目才能从系统打开文件表中移除。
*   **文件在磁盘上的位置 (Disk location of the file)**: 数据访问信息的缓存，加速后续I/O。
*   **访问权限 (Access rights)**: 每个进程对该文件的访问模式信息（如只读、读写）。

### 2.2 文件锁 (File Locks)

某些操作系统和文件系统提供文件锁机制，用于协调对文件的并发访问。

*   类似于**读者-写者锁 (reader-writer locks)**:
    *   **共享锁 (Shared lock)**: 类似读者锁，多个进程可以同时获取。
    *   **互斥锁 (Exclusive lock)**: 类似写者锁，同一时间只允许一个进程获取。
*   **作用**: 调节对文件的访问。
*   **类型**:
    *   **强制锁 (Mandatory locks)**: (如 Windows) 系统根据锁的持有情况和请求来决定是否拒绝访问。如果一个进程试图以与已持有的锁不兼容的方式访问文件，访问将被拒绝。
    *   **劝告锁 (Advisory locks)**: (如 Unix) 系统允许进程查询锁的状态，但由进程自己决定如何行动。即使有锁，进程也可以选择忽略它（除非内核强制执行）。

!!! example "Java 文件锁案例"
    以下Java代码演示了如何使用文件通道 (FileChannel) 对文件部分内容进行加锁：
    ```java
    import java.io.*;
    import java.nio.channels.*;

    public class LockingExample {
        public static final boolean EXCLUSIVE = false; // true for exclusive lock in FileChannel.lock()
        public static final boolean SHARED = true;    // false for shared lock in FileChannel.lock()

        public static void main(String arsg[]) throws IOException {
            FileLock sharedLock = null;
            FileLock exclusiveLock = null;
            try {
                RandomAccessFile raf = new RandomAccessFile("file.txt", "rw");
                // get the channel for the file
                FileChannel ch = raf.getChannel();

                // this locks the first half of the file - exclusive
                // Note: In FileChannel.lock(), the third parameter 'shared'
                // should be 'false' for an exclusive lock and 'true' for a shared lock.
                // The constants in the PPT seem to have this reversed based on their names.
                // Assuming EXCLUSIVE constant means we want an exclusive lock.
                exclusiveLock = ch.lock(0, raf.length() / 2, false); // Corrected based on standard API
                /** Now modify the data . . . */
                System.out.println("Exclusive lock acquired on first half.");
                // release the lock
                exclusiveLock.release();
                System.out.println("Exclusive lock released.");

                // this locks the second half of the file - shared
                sharedLock = ch.lock(raf.length() / 2 + 1, raf.length() - (raf.length() / 2 + 1), true); // Corrected
                /** Now read the data . . . */
                System.out.println("Shared lock acquired on second half.");
                // release the lock
                sharedLock.release();
                System.out.println("Shared lock released.");

            } catch (java.io.IOException ioe) {
                System.err.println(ioe);
            } finally {
                if (exclusiveLock != null && exclusiveLock.isValid())
                    exclusiveLock.release();
                if (sharedLock != null && sharedLock.isValid())
                    sharedLock.release();
            }
        }
    }
    ```
    **注意**: `FileChannel.lock()` 方法的第三个参数 `shared`：`true` 表示共享锁，`false` 表示互斥锁。PPT中的 `EXCLUSIVE = false` 和 `SHARED = true` 可能与 `FileChannel.lock()` API 的直接布尔参数含义相反，或者它们是用于自定义逻辑的常量。上述代码已根据标准API进行调整。

## 三、文件类型与结构

### 3.1 文件类型识别

*   **Windows**: 主要通过**扩展名** (e.g., `.txt`, `.exe`, `.docx`) 识别。
*   **Unix/Linux**: 通常通过文件开头的**魔数 (magic number)** 识别。这是一个特定字节序列，用于标识文件类型。

### 3.2 文件结构

文件内部数据的组织方式：

*   **无结构 (None)**: 文件被视为字节序列或字序列 (sequence of words, bytes)。
*   **简单记录结构 (Simple record structure)**:
    *   行 (Lines)
    *   定长记录 (Fixed length)
    *   变长记录 (Variable length)
*   **复杂结构 (Complex Structures)**:
    *   格式化文档 (Formatted document)
    *   可重定位加载文件 (Relocatable load file)

!!! note "谁来决定结构？"
    文件结构可以由操作系统定义，也可以由应用程序自己解释。简单的无结构方式可以通过在文件中插入适当的控制字符来模拟复杂结构。

## 四、文件访问方法

文件由定长的逻辑记录组成时，常见的访问方法有：

### 4.1 顺序访问 (Sequential Access)

文件信息按顺序处理，这是最常见的访问方法。

*   **操作**:
    *   `read next`: 读取下一个记录。
    *   `write next`: 写入下一个记录。
    *   `reset`: 将文件指针重置到文件开头。
*   磁带等设备天然支持顺序访问。

<!-- PPT Slide 24: 顺序访问示意图 (通常展示一个文件指针从头到尾依次移动) -->

### 4.2 直接访问 (Direct Access / Relative Access)

文件被视为由编号的逻辑块或记录组成，可以快速访问任意块/记录。

*   **操作**:
    *   `read n`: 读取第 `n` 个块/记录。
    *   `write n`: 写入第 `n` 个块/记录。
    *   `position to n`: 将文件指针定位到第 `n` 个块/记录。
    *   `read next`: 读取当前位置的下一个块/记录。
    *   `write next`: 写入当前位置的下一个块/记录。
    *   `rewrite n`: 重写第 `n` 个块/记录。
*   `n` 是**相对块号 (relative block number)**。
*   适用于由固定长度逻辑记录组成的文件。数据库通常采用此方式。

<!-- PPT Slide 25: 直接访问示意图 (通常展示可以直接跳转到文件的任意记录) -->

!!! tip "模拟"
    可以直接访问模拟顺序访问（例如，通过 `position to n` 然后 `read next`）。

### 4.3 其他访问方法 (Indexed Access)

在基本访问方法之上构建更复杂的访问方法，通常涉及为文件创建**索引 (index)**。

*   索引将文件的某些部分（键）映射到其在磁盘上的位置。
*   索引可以保存在内存中以加速查找。
*   如果索引过大，可以创建磁盘索引的内存索引（多级索引）。
*   **示例**: IBM 的索引顺序存取方法 (ISAM - Indexed Sequential-Access Method)。
    *   小型主索引指向二级索引的磁盘块。
    *   文件按定义的键排序。
    *   通过记录的键，至多两次直接访问就可以定位记录。
*   VMS 操作系统也提供索引文件和相关文件。

<!-- PPT Slide 30: 索引文件和相关文件的例子 (通常展示数据文件和其对应的索引文件结构) -->

## 五、磁盘与存储结构

### 5.1 磁盘结构

*   磁盘可以被划分为多个**分区 (partitions)** (也称作 minidisks, slices)。
*   磁盘或分区可以通过 **RAID** 技术进行保护以防故障。
*   磁盘或分区可以**裸用 (raw)**，即不带文件系统，或者用文件系统进行**格式化 (formatted)**。
*   包含文件系统的实体称为**卷 (volume)**。
*   每个包含文件系统的卷也会在**设备目录 (device directory)** 或 **卷内容表 (volume table of contents)** 中跟踪该文件系统的信息。

### 5.2 存储结构层次

<!-- PPT Slide 32: 存储结构 (通常展示从应用程序到逻辑文件系统，再到物理文件系统，最后到存储设备的层次结构) -->
存储系统通常是分层的，从用户视角的文件到底层物理块的映射。

### 5.3 文件系统的类型

除了通用的文件系统，系统中常有多种特殊用途的文件系统。

*   **示例 (Solaris)**:
    *   `tmpfs`: 基于内存的易失性文件系统，用于快速临时I/O。
    *   `objfs`: 内核内存接口，用于获取内核符号进行调试。
    *   `ctfs`: 契约文件系统，用于管理守护进程。
    *   `lofs`: 环回文件系统，允许一个文件系统在另一个位置被访问。
    *   `procfs`: 内核到进程结构的接口。
    *   `ufs`, `zfs`: 通用文件系统。

## 六、目录结构

目录是包含所有文件信息的节点的集合。目录结构和文件本身都驻留在磁盘上。

### 6.1 目录操作

*   **搜索文件 (Search for a file)**
*   **创建文件 (Create a file)**
*   **删除文件 (Delete a file)**
*   **列出目录内容 (List a directory)**
*   **重命名文件 (Rename a file)**
*   **遍历文件系统 (Traverse the file system)**

### 6.2 目录组织目标

*   **效率 (Efficiency)**: 快速定位文件。
*   **命名 (Naming)**: 方便用户。
    *   不同用户可以为不同文件使用相同名称。
    *   同一文件可以有多个不同名称 (别名)。
*   **分组 (Grouping)**: 按属性对文件进行逻辑分组 (例如，所有Java程序、所有游戏等)。

### 6.3 常见目录结构

#### 1. 单级目录 (Single-Level Directory)

所有用户共享一个目录。

*   **问题**:
    *   命名冲突 (Naming problem): 不同用户的文件名必须唯一。
    *   分组困难 (Grouping problem)。

#### 2. 两级目录 (Two-Level Directory)

为每个用户创建一个独立的目录。

*   **路径名 (Path name)**: 通常是 `用户目录/文件名`。
*   不同用户可以使用相同的文件名。
*   搜索效率较高（在用户自己的目录内）。

#### 3. 树形目录 (Tree-Structured Directory)

目录可以包含文件和其他目录，形成树状结构。这是最常用的一种结构。

*   每个文件都有唯一的路径名。
*   可以方便地进行分组。
*   **当前目录 (Current Directory / Working Directory)**: 用户可以指定一个目录作为当前工作目录，文件引用可以相对于此目录。
    *   `cd /spell/mail/prog`：改变当前目录。
    *   `mkdir <dir-name>`：在当前目录下创建新目录。
    *   删除一个目录（如 "mail"）通常意味着删除其下的整个子树。

#### 4. 无环图目录 (Acyclic-Graph Directories)

允许目录共享子目录和文件，形成一个有向无环图 (DAG)。

*   **别名 (Aliasing)**: 同一个文件或子目录可以有两个或多个不同的路径名。
*   **问题**:
    *   **悬空指针 (Dangling pointer)**: 如果一个共享文件被删除，指向它的其他目录条目会变成悬空指针。
        *   **解决方案**:
            *   **反向指针 (Backpointers)**: 记录所有指向该文件的指针，删除文件时一并删除。实现复杂，尤其当记录大小可变时。可以使用菊花链组织反向指针。
            *   **入口保持计数 (Entry-hold-count / Reference count)**: 每个文件维护一个计数器，记录有多少目录条目指向它。只有当计数为0时才真正删除文件。
*   **链接 (Link)**:
    *   **软链接 (Symbolic Link / Soft Link)**: 创建一个特殊文件，内容是另一个文件的路径名。删除原文件会导致软链接失效。
    *   **硬链接 (Hard Link)**: 创建一个指向文件物理数据块的目录条目。只有当所有硬链接都被删除（引用计数为0）时，文件数据才会被删除。通常不允许对目录创建硬链接（以防循环）。

#### 5. 通用图目录 (General Graph Directory)

允许目录结构中存在**循环 (cycles)**。

*   **问题**: 搜索算法可能陷入死循环，计算空间占用等变得复杂。
*   **如何保证无环或处理循环?**
    *   只允许链接到文件，不允许链接到子目录（这是许多系统避免循环的方式）。
    *   **垃圾收集 (Garbage collection)**: 定期扫描文件系统，回收不可达的块。
    *   每次添加新链接时，使用**循环检测算法 (cycle detection algorithm)** 来确定是否会形成循环。

## 七、文件系统保护

文件所有者/创建者应该能够控制：

*   **可以执行哪些操作 (What can be done)**
*   **由谁执行 (By whom)**

### 7.1 访问类型 (Types of Access)

*   **读取 (Read)**: 从文件读取数据。
*   **写入 (Write)**: 修改或追加数据到文件。
*   **执行 (Execute)**: 将文件作为程序加载到内存并运行。
*   **追加 (Append)**: 只能在文件末尾添加数据，不能修改已有数据。
*   **删除 (Delete)**: 删除文件。
*   **列出 (List)**: 列出目录内容（适用于目录）。

### 7.2 Linux/Unix 文件访问控制

*   **访问模式 (Mode of access)**: 读 (r), 写 (w), 执行 (x)。
*   **三类用户**:
    1.  **所有者 (Owner)**: 创建文件的用户。
    2.  **组 (Group)**: 一组用户，共享访问权限。
    3.  **其他/公共 (Public/Others)**: 系统中的所有其他用户。
*   **权限表示**:
    *   通常用9个字符表示，如 `rwxr-xr--`。
    *   八进制表示：`r=4, w=2, x=1`。
        *   `owner access: 7 (rwx) implies 111_binary`
        *   `group access: 6 (rw-) implies 110_binary`
        *   `public access: 1 (--x) implies 001_binary`
*   **组管理**: 管理员可以创建组，并将用户添加到组中。
*   `chgrp G filename`: 将文件 `filename` 的所属组更改为 `G`。
*   `chmod <mode> filename`: 更改文件 `filename` 的权限。

<!-- PPT Slide 38: Unix文件目录示例 (类似ls -l输出，展示了文件类型、权限、链接数、所有者、组、大小、修改时间、文件名) -->
<!-- 例如: drwxr-xr-x 2 user group 4096 May 15 10:00 mydir -->
<!-- -rw-r--r-- 1 user group 1024 May 14 09:30 myfile.txt -->