/**
 * Backend se aane wala folder (flat list).
 * parentId = null matlab root level.
 */
export interface FlatFolder {
  id: string
  name: string
  parentId: string | null
  path?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Tree node - flat list ko buildTree() se banaya jata hai.
 * children = andar wale folders (dropdown ke andar dropdown).
 */
export interface FolderNode {
  id: string
  name: string
  parentId: string | null
  path: string
  children: FolderNode[]
  order?: number
}

/** Flat list se tree banane ke liye. Root = jinke parentId null. */
export function buildFolderTree(flat: FlatFolder[]): FolderNode[] {
  const map = new Map<string, FolderNode>()
  flat.forEach((f) => {
    map.set(f.id, {
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      path: f.path ?? `/${f.id}`,
      children: [],
      order: f.order,
    })
  })
  const roots: FolderNode[] = []
  map.forEach((node) => {
    if (node.parentId == null) {
      roots.push(node)
    } else {
      const parent = map.get(node.parentId)
      if (parent) parent.children.push(node)
    }
  })
  const sort = (nodes: FolderNode[]) =>
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const sortChildren = (node: FolderNode) => {
    sort(node.children)
    node.children.forEach(sortChildren)
  }
  roots.forEach(sortChildren)
  sort(roots)
  return roots
}
