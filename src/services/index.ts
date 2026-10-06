import { findDataIntegrityProblems } from './dataIntegrity'

export { categoryService } from './categoryService'
export { productService } from './productService'
export { shopService } from './shopService'

if (import.meta.env.DEV) {
  const problems = findDataIntegrityProblems()
  if (problems.length > 0) {
    console.error(
      `[Fresh & Good] Seed data has ${problems.length} problem(s):\n- ${problems.join('\n- ')}`,
    )
  }
}
