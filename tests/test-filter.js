// Test suite for tab filtering functionality
// Run with: node tests/test-filter.js

// Import the filtering functions (in a real implementation these would be imported)
function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function filterMatch (needle, haystack) {
  if (needle === '') return true
  
  var regex = new RegExp(escapeRegExp(needle), 'i')
  
  // For single special characters, only search titles to avoid matching every URL
  // This prevents "." from matching all tabs since most URLs contain dots
  if (needle.length === 1 && /[.*+?^${}()|[\]\\]/.test(needle)) {
    return haystack.length > 0 && regex.test(haystack[0])
  }
  
  // For other inputs, search both title and URL as before
  var match = false
  haystack.forEach(function (element) {
    if (regex.test(element)) match = true
  })
  return match
}

// Test data simulating real browser tabs
const testTabs = [
  { title: ". dot at the beginning of the title", url: "https://github.com/issue/5" },
  { title: ".hidden file", url: "https://example.com/hidden" },
  { title: "* Important note", url: "https://docs.google.com/document" },
  { title: "Normal tab", url: "https://google.com" },
  { title: "Another tab", url: "https://stackoverflow.com" },
  { title: "Sessions · [WIP]", url: "https://github.com/falkorichter/export" },
  { title: "Chrome Web Store", url: "https://chromewebstore.google.com/detail" },
  { title: "Posteingang (3.046)", url: "https://mail.google.com/mail/u/0/#inbox" }
]

// Test cases based on reported issues
const testCases = [
  {
    input: ".",
    description: "Single dot should only match titles with dots, not all URLs",
    expectedCount: 3, // Three tabs have dots in titles: ". dot...", ".hidden file", "Posteingang (3.046)"
    expectAllTabs: false
  },
  {
    input: "......",
    description: "Multiple dots should match titles with consecutive dots (none in this case)",
    expectedCount: 0,
    expectAllTabs: false
  },
  {
    input: "*",
    description: "Asterisk should only match titles with asterisks",
    expectedCount: 1,
    expectAllTabs: false
  },
  {
    input: "google",
    description: "Regular text should search both titles and URLs",
    expectedCount: 4, // Four tabs contain "google" in URL or title
    expectAllTabs: false
  },
  {
    input: "[WIP]",
    description: "Text with special regex chars should be escaped and searched normally",
    expectedCount: 1,
    expectAllTabs: false
  },
  {
    input: "",
    description: "Empty input should match all tabs",
    expectedCount: testTabs.length,
    expectAllTabs: true
  }
]

function runTests() {
  console.log("Tab Filtering Test Suite")
  console.log("========================\n")
  
  let passed = 0
  let failed = 0
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.description}`)
    console.log(`Input: "${testCase.input}"`)
    
    // Run the filter
    let matches = testTabs.filter(tab => 
      filterMatch(testCase.input, [tab.title, tab.url])
    )
    
    console.log(`Result: ${matches.length}/${testTabs.length} matches`)
    
    // Check expectations
    let testPassed = true
    
    if (matches.length !== testCase.expectedCount) {
      console.log(`❌ FAIL: Expected ${testCase.expectedCount} matches, got ${matches.length}`)
      testPassed = false
      console.log("Matched tabs:")
      matches.forEach(match => console.log(`  - ${match.title}`))
    } else {
      console.log("✅ PASS")
    }
    
    if (testPassed) {
      passed++
    } else {
      failed++
    }
    
    console.log("")
  })
  
  // Test regex escaping specifically
  console.log("Regex Escaping Tests")
  console.log("===================")
  
  const specialChars = [".", "*", "?", "+", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"]
  let escapeTestsPassed = true
  
  specialChars.forEach(char => {
    const escaped = escapeRegExp(char)
    const regex = new RegExp(escaped)
    
    // Test that the escaped version matches the literal character
    if (!regex.test(char)) {
      console.log(`❌ FAIL: "${char}" → "${escaped}" doesn't match literal character`)
      escapeTestsPassed = false
    }
  })
  
  if (escapeTestsPassed) {
    console.log("✅ All regex escaping tests passed")
    passed++
  } else {
    failed++
  }
  
  console.log(`\nSummary: ${passed} passed, ${failed} failed`)
  
  if (failed === 0) {
    console.log("🎉 All tests passed!")
    return 0
  } else {
    console.log("💥 Some tests failed")
    return 1
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  process.exit(runTests())
}

module.exports = { escapeRegExp, filterMatch, testTabs, testCases, runTests }