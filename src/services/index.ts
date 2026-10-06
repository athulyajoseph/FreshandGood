import { findDataIntegrityProblems } from './dataIntegrity'

export { categoryService } from './categoryService'
export { contentService } from './contentService'
export { productService } from './productService'
export { searchService } from './searchService'
export { shopService } from './shopService'

if (import.meta.env.DEV) {
  const problems = findDataIntegrityProblems()
  if (problems.length > 0) {
    console.error(
      `[Fresh & Good] Seed data has ${problems.length} problem(s):\n- ${problems.join('\n- ')}`,
    )
  }
}
