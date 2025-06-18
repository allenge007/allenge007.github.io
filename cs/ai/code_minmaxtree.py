import graphviz
import math
from copy import deepcopy

# --- AlphaBetaVisualizer class (handles Alpha-Beta pruning logic) ---
class AlphaBetaVisualizer:
    def __init__(self, tree_data):
        self.original_tree_data = tree_data
        self.node_id_counter = 0
        # Python dicts automatically handle duplicate keys by keeping the last one.
        self.annotated_tree_ab = self._add_ids_and_ab_placeholders(deepcopy(tree_data))

    def _add_ids_and_ab_placeholders(self, node_dict_or_list):
        if isinstance(node_dict_or_list, list) and all(isinstance(x, int) for x in node_dict_or_list):
            return node_dict_or_list # Leaf utility list
        if isinstance(node_dict_or_list, int):
             return node_dict_or_list # Should not happen at this stage for a node

        node = dict(node_dict_or_list) 
        self.node_id_counter += 1
        node['id'] = self.node_id_counter
        node['value_ab'] = None
        node['alpha_parent'] = None
        node['beta_parent'] = None
        node['is_pruned_node'] = False 

        if 'children' in node and isinstance(node['children'], list):
            if not all(isinstance(child, int) for child in node['children']): # Has dict children
                node['children'] = [self._add_ids_and_ab_placeholders(child) for child in node['children']]
        return node

    def _format_value(self, val):
        if val == float('inf'): return "+inf"
        if val == -float('inf'): return "-inf"
        if isinstance(val, str): return val # For "PRUNED"
        return f"{val:.0f}" if isinstance(val, (float, int)) and float(val).is_integer() else str(val)

    def run_alpha_beta(self):
        if not self.annotated_tree_ab:
            return None
        final_value = self._alpha_beta_recursive(self.annotated_tree_ab, -float('inf'), float('inf'), True)
        print(f"树的最终评估值 (Alpha-Beta): {self._format_value(final_value)}")
        return final_value

    def _alpha_beta_recursive(self, current_node_annotated, alpha, beta, is_maximizing_player):
        node_id = current_node_annotated['id']
        node_type = current_node_annotated['type']
        children_data = current_node_annotated['children']

        current_node_annotated['alpha_parent'] = alpha
        current_node_annotated['beta_parent'] = beta

        if all(isinstance(child, int) for child in children_data): # Pre-terminal node
            if node_type == "max":
                value = max(children_data) if children_data else -float('inf')
            elif node_type == "min":
                value = min(children_data) if children_data else float('inf')
            else: raise ValueError(f"Node {node_id}: Invalid type for pre-terminal node")
            current_node_annotated['value_ab'] = value
            return value

        if is_maximizing_player:
            max_eval = -float('inf')
            child_idx = 0
            for child_node_data in children_data:
                eval_val = self._alpha_beta_recursive(child_node_data, alpha, beta, False)
                max_eval = max(max_eval, eval_val)
                alpha = max(alpha, eval_val)
                if beta <= alpha:
                    for i in range(child_idx + 1, len(children_data)):
                        pruned_child_node = children_data[i]
                        pruned_child_node['is_pruned_node'] = True
                        self._mark_subtree_pruned(pruned_child_node, alpha, beta)
                    break
                child_idx += 1
            self.set_alpha_beta(current_node_annotated, alpha, beta)
            current_node_annotated['value_ab'] = max_eval
            return max_eval
        else: # MIN player
            min_eval = float('inf')
            child_idx = 0
            for child_node_data in children_data:
                eval_val = self._alpha_beta_recursive(child_node_data, alpha, beta, True)
                min_eval = min(min_eval, eval_val)
                beta = min(beta, eval_val)
                if beta <= alpha:
                    for i in range(child_idx + 1, len(children_data)):
                        pruned_child_node = children_data[i]
                        pruned_child_node['is_pruned_node'] = True
                        self._mark_subtree_pruned(pruned_child_node, alpha, beta)
                    break
                child_idx += 1
            self.set_alpha_beta(current_node_annotated, alpha, beta)
            current_node_annotated['value_ab'] = min_eval
            return min_eval

    def set_alpha_beta(self, node, alpha, beta):
        node['alpha_parent'] = alpha
        node['beta_parent'] = beta

    def _mark_subtree_pruned(self, node, alpha_at_prune, beta_at_prune):
        node['value_ab'] = "PRUNED"
        node['is_pruned_node'] = True
        node['alpha_parent'] = alpha_at_prune 
        node['beta_parent'] = beta_at_prune

        if 'children' in node and isinstance(node['children'], list):
            if not all(isinstance(child, int) for child in node['children']):
                for child_node in node['children']:
                    self._mark_subtree_pruned(child_node, alpha_at_prune, beta_at_prune)
    
    def get_annotated_tree(self):
        return self.annotated_tree_ab

# --- Minimax (no pruning) calculation ---
node_id_counter_minimax_global = 0

def add_ids_and_minimax_values(node_dict_or_list_orig):
    global node_id_counter_minimax_global
    node_dict = deepcopy(node_dict_or_list_orig)

    node_id_counter_minimax_global += 1
    node_dict['id'] = node_id_counter_minimax_global
    
    if 'children' in node_dict and isinstance(node_dict['children'], list):
        if not all(isinstance(child, int) for child in node_dict['children']): # Has dict children
            node_dict['children'] = [add_ids_and_minimax_values(child) for child in node_dict['children']]
            if node_dict['type'] == "max":
                node_dict['minimax_value'] = max(child['minimax_value'] for child in node_dict['children'])
            elif node_dict['type'] == "min":
                node_dict['minimax_value'] = min(child['minimax_value'] for child in node_dict['children'])
        else: # Pre-terminal node with list of int children
            if node_dict['type'] == "max":
                node_dict['minimax_value'] = max(node_dict['children']) if node_dict['children'] else -float('inf')
            elif node_dict['type'] == "min":
                node_dict['minimax_value'] = min(node_dict['children']) if node_dict['children'] else float('inf')
    else: # Should not happen for a well-formed game tree node
        node_dict['minimax_value'] = None 
            
    return node_dict

# --- Graphviz plotting functions ---
def format_val_for_graph(val):
    if val == float('inf'): return "+&infin;"
    if val == -float('inf'): return "-&infin;"
    if isinstance(val, str): return val # For "PRUNED"
    return str(int(val)) if isinstance(val, (float, int)) and float(val).is_integer() else str(val)

def build_dot_before(dot, tree_node):
    node_id_str = str(tree_node['id'])
    label = f"<<b>ID: {tree_node['id']} ({tree_node['type']})</b><br/>Minimax: {format_val_for_graph(tree_node['minimax_value'])}>"
    
    fillcolor = 'lightblue' if tree_node['type'] == "max" else 'lightpink'
    shape = 'box' if tree_node['type'] == "max" else 'ellipse'
    dot.node(node_id_str, label=f'<{label}>', shape=shape, style='filled', fillcolor=fillcolor)

    if 'children' in tree_node:
        if all(isinstance(child, int) for child in tree_node['children']): # Pre-terminal
            util_node_id = f"util_{node_id_str}"
            util_label = f"Values: {tree_node['children']}"
            dot.node(util_node_id, util_label, shape='plaintext')
            dot.edge(node_id_str, util_node_id)
        else:
            for child_node in tree_node['children']:
                build_dot_before(dot, child_node)
                dot.edge(node_id_str, str(child_node['id']))

def build_dot_after(dot, tree_node_ab):
    node_id_str = str(tree_node_ab['id'])
    val_ab_str = format_val_for_graph(tree_node_ab['value_ab'])
    alpha_p_str = format_val_for_graph(tree_node_ab['alpha_parent'])
    beta_p_str = format_val_for_graph(tree_node_ab['beta_parent'])
    
    label_content = f"<b>ID: {tree_node_ab['id']} ({tree_node_ab['type']})</b><br/>Val: {val_ab_str}<br/>(&alpha;<sub>p</sub>: {alpha_p_str}, &beta;<sub>p</sub>: {beta_p_str})"
    
    node_attrs = {'shape': 'box' if tree_node_ab['type'] == "max" else 'ellipse', 'style': 'filled'}

    if tree_node_ab.get('is_pruned_node', False):
        node_attrs['fillcolor'] = 'gray' # Pruned nodes are gray
        node_attrs['fontcolor'] = 'white'
        label_content = f"<b>ID: {tree_node_ab['id']} ({tree_node_ab['type']})</b><br/><i>PRUNED</i><br/>(&alpha;<sub>prune</sub>: {alpha_p_str}, &beta;<sub>prune</sub>: {beta_p_str})"
    elif tree_node_ab['type'] == "max":
        node_attrs['fillcolor'] = 'lightblue'
    else: # min
        node_attrs['fillcolor'] = 'lightpink'
        
    dot.node(node_id_str, label=f'<{label_content}>', **node_attrs)

    if 'children' in tree_node_ab:
        if all(isinstance(child, int) for child in tree_node_ab['children']): # Pre-terminal
            if not tree_node_ab.get('is_pruned_node', False):
                util_node_id = f"util_{node_id_str}_ab"
                util_label = f"Values: {tree_node_ab['children']}"
                dot.node(util_node_id, util_label, shape='plaintext')
                dot.edge(node_id_str, util_node_id)
        else: # Has dict children
            for child_node_ab in tree_node_ab['children']:
                build_dot_after(dot, child_node_ab) # Recursively build child
                edge_attrs = {}
                if child_node_ab.get('is_pruned_node', False):
                    # Edge leading to a pruned subtree's root
                    edge_attrs = {'color': 'red', 'style': 'dashed', 'label': ' X', 'fontcolor': 'red'}
                dot.edge(node_id_str, str(child_node_ab['id']), **edge_attrs)

# --- Main execution ---
tree_input = {
    "type": "max",
    "children": [
        {  # 左子树
            "type": "min",
            "children": [ # 第一个 "children" 键，会被覆盖
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [4, 7]},
                        {"type": "min", "children": [5, 1, 9]},
                        {"type": "min", "children": [3, 6]},
                    ],
                },
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [9, 8]},
                        {"type": "min", "children": [7, 2, 5]},
                    ],
                }
            ],
        },
        {  # 中子树
            "type": "min",
            "children": [ # 第一个
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [6, 3]},
                        {"type": "min", "children": [6, 5]},
                        {"type": "min", "children": [2, 7]},
                    ],
                },
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [2]},
                    ],
                },
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [6, 3]},
                        {"type": "min", "children": [8, 1]},
                    ],
                }
            ],
        },
        {  # 右子树
            "type": "min",
            "children": [ # 第一个
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [4, 0]},
                        {"type": "min", "children": [3, 1]},
                    ],
                },
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [8, 9]},
                        {"type": "min", "children": [3, 7]},
                    ],
                },
                {
                    "type": "max",
                    "children": [
                        {"type": "min", "children": [4]},
                        {"type": "min", "children": [2, 8]},
                    ],
                }

            ],
        }
    ]
}

# 1. Before Pruning Visualization
node_id_counter_minimax_global = 0 # Reset global counter
tree_with_minimax_values = add_ids_and_minimax_values(tree_input)

dot_before = graphviz.Digraph('MinimaxTree_Before', comment='Minimax Tree Before Pruning')
dot_before.attr(rankdir='TB', labelloc="t", label="Minimax Tree (Before Pruning)", fontsize="20")
build_dot_before(dot_before, tree_with_minimax_values)
try:
    dot_before.render('minimax_tree_before', view=False, format='png')
    print("Generated minimax_tree_before.png")
except graphviz.exceptions.ExecutableNotFound:
    print("Graphviz executable not found. Please ensure Graphviz is installed and in your PATH.")
except Exception as e:
    print(f"Error rendering 'before' graph: {e}")


# 2. After Alpha-Beta Pruning Visualization
visualizer = AlphaBetaVisualizer(tree_input)
visualizer.run_alpha_beta()
annotated_tree_for_graphing = visualizer.get_annotated_tree()

dot_after = graphviz.Digraph('MinimaxTree_After_AB', comment='Minimax Tree After Alpha-Beta Pruning')
dot_after.attr(rankdir='TB', labelloc="t", label="Minimax Tree (After Alpha-Beta Pruning)", fontsize="20")
build_dot_after(dot_after, annotated_tree_for_graphing)
try:
    dot_after.render('minimax_tree_after_ab', view=False, format='png')
    print("Generated minimax_tree_after_ab.png")
except graphviz.exceptions.ExecutableNotFound:
    print("Graphviz executable not found. Please ensure Graphviz is installed and in your PATH.")
except Exception as e:
    print(f"Error rendering 'after' graph: {e}")