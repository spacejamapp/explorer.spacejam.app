import * as path from "path"
import * as fs from "fs"
import matter from "gray-matter"
import { cache } from 'react'

const docsDirectory = path.join(process.cwd(), "docs")
const summaryPath = path.join(docsDirectory, "summary.json")

export interface DocMeta {
  title: string
  description?: string
  slug: string
}

export interface NavItem {
  title: string
  href: string
  items?: NavItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

interface SummaryPage {
  title: string
  description: string
  href: string
}

interface SummarySection {
  section: string
  pages: SummaryPage[]
}

// Load summary.json to get the documentation structure
const loadSummary = cache((): SummarySection[] => {
  try {
    if (!fs.existsSync(summaryPath)) {
      console.error(`Summary file not found: ${summaryPath}`)
      return []
    }

    const summaryContent = fs.readFileSync(summaryPath, "utf8")
    const summary = JSON.parse(summaryContent) as SummarySection[]
    
    // Log summary for debugging
    console.log("Loaded summary.json:", JSON.stringify(summary, null, 2))
    
    return summary
  } catch (error) {
    console.error("Error loading summary.json:", error)
    return []
  }
})

// Normalize the file path from summary.json to actual file path
const normalizeFilePath = (href: string): string => {
  // If href starts with /, remove the leading slash
  const normalizedHref = href.startsWith('/') ? href.substring(1) : href
  const fullPath = path.join(process.cwd(), normalizedHref)
  
  // Log path conversion for debugging
  console.log(`Path conversion: ${href} -> ${fullPath}`)
  
  return fullPath
}

// Extract slug from href
const getSlugFromHref = (href: string): string => {
  // Special case for README.md at the root
  if (href === '/docs/README.md') {
    return '';
  }
  
  // Remove /docs/ prefix if present
  const withoutDocsPrefix = href.replace(/^\/docs\//, '')
  
  // Remove .md extension
  const withoutExtension = withoutDocsPrefix.replace(/\.md$/, '')
  
  // Handle README.md files in subdirectories - they represent the directory itself
  if (withoutExtension.endsWith('/README')) {
    return withoutExtension.replace(/\/README$/, '')
  }
  
  const result = withoutExtension
  console.log(`Slug extraction: ${href} -> ${result}`)
  return result
}

// Get metadata for a specific markdown file
const getDocMetaFromFile = (filePath: string, href: string): DocMeta | null => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`)
      return null
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContents)
    const slug = getSlugFromHref(href)

    const docMeta = {
      title: data.title || path.basename(slug) || "Untitled",
      description: data.description,
      slug: slug,
    }
    
    console.log(`DocMeta for ${filePath}:`, docMeta)
    
    return docMeta
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    return null
  }
}

// Use React cache to memoize the results
export const getDocsMeta = cache((): DocMeta[] => {
  try {
    const summary = loadSummary()
    const docs: DocMeta[] = []

    summary.forEach(section => {
      section.pages.forEach(page => {
        const filePath = normalizeFilePath(page.href)
        const docMeta = getDocMetaFromFile(filePath, page.href)
        
        if (docMeta) {
          // Override with summary data if available
          const finalMeta = {
            ...docMeta,
            title: page.title || docMeta.title,
            description: page.description || docMeta.description,
          }
          docs.push(finalMeta)
          console.log(`Added doc with slug: ${finalMeta.slug}`)
        }
      })
    })

    console.log(`Total docs found: ${docs.length}`)
    return docs
  } catch (error) {
    console.error("Error getting docs metadata:", error)
    return []
  }
})

// Use React cache to memoize the navigation
export const getNavigation = cache((): NavGroup[] => {
  try {
    const summary = loadSummary()
    
    const navigation = summary.map(section => {
      return {
        title: section.section,
        items: section.pages.map(page => {
          const slug = getSlugFromHref(page.href)
          const href = slug === '' ? '/docs' : `/docs/${slug}`
          
          console.log(`Navigation item: ${page.title} -> ${href}`)
          
          return {
            title: page.title,
            href: href,
          }
        })
      }
    })
    
    console.log("Generated navigation:", JSON.stringify(navigation, null, 2))
    return navigation
  } catch (error) {
    console.error("Error generating navigation:", error)
    return []
  }
}) 