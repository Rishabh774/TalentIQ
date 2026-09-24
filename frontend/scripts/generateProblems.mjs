// Generates 100 UNIQUE, runnable, judge-testable DSA problems into src/data/problems.js
// Each problem is its own distinct archetype (no numbered duplicates). Each carries:
// function signature (params/ret types), test cases, and a canonical expectedOutput
// computed from a JS reference solution. The frontend judge (lib/judge.js) wraps the
// student's function with a per-language harness, runs it, and compares stdout.
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../src/data/problems.js");

// ---- seeded RNG (mulberry32) ----
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ri = (r, min, max) => Math.floor(r() * (max - min + 1)) + min;
const rarr = (r, len, min, max) => Array.from({ length: len }, () => ri(r, min, max));
const rsortedArr = (r, len, min, max) => rarr(r, len, min, max).sort((a, b) => a - b);
const WORDS = ["code", "level", "racecar", "hello", "world", "data", "node", "stack", "queue", "graph", "array", "logic", "binary", "tree", "hash", "sort", "swap", "loop", "byte", "cache", "kayak", "madam", "redo", "stats", "noon"];
const rword = (r) => WORDS[ri(r, 0, WORDS.length - 1)];
const canon = (v) => JSON.stringify(v);

const ALL_COMPANIES = ["Google", "Amazon", "Meta", "Microsoft", "Uber", "Netflix", "Adobe"];
const FREQS = ["High", "Medium", "Low"];

// ---- 100 unique archetypes ----
const ARCH = [
  // =================== EASY (40) ===================
  { key: "two-sum", title: "Two Sum", difficulty: "Easy", category: "Array - Hash Table",
    functionName: "twoSum", params: ["int[]", "int"], ret: "int[]",
    desc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    notes: ["Exactly one solution exists."],
    fn: (nums, target) => { const m = new Map(); for (let i = 0; i < nums.length; i++) { if (m.has(target - nums[i])) return [m.get(target - nums[i]), i]; m.set(nums[i], i); } return []; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const n = ri(r, 4, 7); const arr = rarr(r, n, 1, 20); const i = ri(r, 0, n - 2), j = ri(r, i + 1, n - 1); out.push([arr, arr[i] + arr[j]]); } return out; } },

  { key: "reverse-string", title: "Reverse String", difficulty: "Easy", category: "String - Two Pointers",
    functionName: "reverseString", params: ["string"], ret: "string",
    desc: "Write a function that reverses a string and returns the reversed string.",
    notes: [],
    fn: (s) => s.split("").reverse().join(""),
    tests: (r) => Array.from({ length: 3 }, () => [rword(r)]) },

  { key: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", category: "String",
    functionName: "isPalindrome", params: ["string"], ret: "boolean",
    desc: "Given a string s, return true if it is a palindrome considering only alphanumeric characters, ignoring case.",
    notes: [],
    fn: (s) => { const t = s.toLowerCase().replace(/[^a-z0-9]/g, ""); return t === t.split("").reverse().join(""); },
    tests: (r) => [["racecar"], [rword(r)], [rword(r) + rword(r).split("").reverse().join("")]] },

  { key: "max-element", title: "Maximum Element", difficulty: "Easy", category: "Array",
    functionName: "maxElement", params: ["int[]"], ret: "int",
    desc: "Return the maximum value in the array nums.",
    notes: [],
    fn: (nums) => Math.max(...nums),
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 4, 8), -20, 50)]) },

  { key: "min-element", title: "Minimum Element", difficulty: "Easy", category: "Array",
    functionName: "minElement", params: ["int[]"], ret: "int",
    desc: "Return the minimum value in the array nums.",
    notes: [],
    fn: (nums) => Math.min(...nums),
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 4, 8), -20, 50)]) },

  { key: "sum-array", title: "Sum of Array", difficulty: "Easy", category: "Array",
    functionName: "sumArray", params: ["int[]"], ret: "int",
    desc: "Return the sum of all elements in the array nums.",
    notes: [],
    fn: (nums) => nums.reduce((a, b) => a + b, 0),
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 3, 8), -10, 30)]) },

  { key: "average-array", title: "Average of Array (floor)", difficulty: "Easy", category: "Array - Math",
    functionName: "averageFloor", params: ["int[]"], ret: "int",
    desc: "Return floor(average) of the integers in nums.",
    notes: [],
    fn: (nums) => Math.floor(nums.reduce((a, b) => a + b, 0) / nums.length),
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 3, 8), 1, 40)]) },

  { key: "count-vowels", title: "Count Vowels", difficulty: "Easy", category: "String",
    functionName: "countVowels", params: ["string"], ret: "int",
    desc: "Return the number of vowels (a, e, i, o, u) in the lowercase string s.",
    notes: [],
    fn: (s) => (s.match(/[aeiou]/g) || []).length,
    tests: (r) => Array.from({ length: 3 }, () => [rword(r)]) },

  { key: "count-consonants", title: "Count Consonants", difficulty: "Easy", category: "String",
    functionName: "countConsonants", params: ["string"], ret: "int",
    desc: "Return the number of consonant letters in the lowercase string s.",
    notes: [],
    fn: (s) => (s.match(/[a-z]/g) || []).filter((c) => !"aeiou".includes(c)).length,
    tests: (r) => Array.from({ length: 3 }, () => [rword(r)]) },

  { key: "factorial", title: "Factorial", difficulty: "Easy", category: "Math - Recursion",
    functionName: "factorial", params: ["int"], ret: "int",
    desc: "Return n! (the factorial of n). Assume 0 <= n <= 12.",
    notes: [],
    fn: (n) => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; },
    tests: (r) => [[ri(r, 0, 6)], [ri(r, 5, 9)], [ri(r, 1, 12)]] },

  { key: "is-prime", title: "Prime Check", difficulty: "Easy", category: "Math",
    functionName: "isPrime", params: ["int"], ret: "boolean",
    desc: "Return true if the integer n is a prime number, otherwise false.",
    notes: [],
    fn: (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; },
    tests: (r) => [[ri(r, 2, 30)], [ri(r, 1, 100)], [ri(r, 50, 120)]] },

  { key: "gcd", title: "Greatest Common Divisor", difficulty: "Easy", category: "Math",
    functionName: "gcd", params: ["int", "int"], ret: "int",
    desc: "Return the greatest common divisor of two positive integers a and b.",
    notes: [],
    fn: (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; },
    tests: (r) => Array.from({ length: 3 }, () => [ri(r, 2, 100), ri(r, 2, 100)]) },

  { key: "lcm", title: "Least Common Multiple", difficulty: "Easy", category: "Math",
    functionName: "lcm", params: ["int", "int"], ret: "int",
    desc: "Return the least common multiple of two positive integers a and b.",
    notes: [],
    fn: (a, b) => { const g = ((x, y) => { while (y) { [x, y] = [y, x % y]; } return x; })(a, b); return (a * b) / g; },
    tests: (r) => Array.from({ length: 3 }, () => [ri(r, 2, 20), ri(r, 2, 20)]) },

  { key: "fibonacci", title: "Nth Fibonacci", difficulty: "Easy", category: "Dynamic Programming",
    functionName: "fib", params: ["int"], ret: "int",
    desc: "Return the nth Fibonacci number (0-indexed): fib(0)=0, fib(1)=1.",
    notes: [],
    fn: (n) => { let a = 0, b = 1; for (let i = 0; i < n; i++) { [a, b] = [b, a + b]; } return a; },
    tests: (r) => [[ri(r, 0, 10)], [ri(r, 10, 20)], [ri(r, 5, 30)]] },

  { key: "reverse-integer", title: "Reverse Digits", difficulty: "Easy", category: "Math",
    functionName: "reverseDigits", params: ["int"], ret: "int",
    desc: "Given a non-negative integer n, return the integer formed by reversing its digits (drop leading zeros).",
    notes: [],
    fn: (n) => parseInt(String(n).split("").reverse().join(""), 10),
    tests: (r) => Array.from({ length: 3 }, () => [ri(r, 10, 99999)]) },

  { key: "linear-search", title: "Linear Search", difficulty: "Easy", category: "Array - Search",
    functionName: "search", params: ["int[]", "int"], ret: "int",
    desc: "Return the index of target in nums, or -1 if not present (first occurrence).",
    notes: [],
    fn: (nums, target) => nums.indexOf(target),
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const a = rarr(r, ri(r, 4, 8), 1, 15); out.push([a, t === 0 ? a[ri(r, 0, a.length - 1)] : ri(r, 16, 30)]); } return out; } },

  { key: "is-even", title: "Count Even Numbers", difficulty: "Easy", category: "Array",
    functionName: "countEven", params: ["int[]"], ret: "int",
    desc: "Return the count of even numbers in nums.",
    notes: [],
    fn: (nums) => nums.filter((x) => x % 2 === 0).length,
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), -10, 10)]) },

  { key: "is-odd", title: "Count Odd Numbers", difficulty: "Easy", category: "Array",
    functionName: "countOdd", params: ["int[]"], ret: "int",
    desc: "Return the count of odd numbers in nums.",
    notes: [],
    fn: (nums) => nums.filter((x) => Math.abs(x % 2) === 1).length,
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), -10, 10)]) },

  { key: "string-to-upper", title: "To Uppercase", difficulty: "Easy", category: "String",
    functionName: "toUpper", params: ["string"], ret: "string",
    desc: "Return the string s converted to uppercase.",
    notes: [],
    fn: (s) => s.toUpperCase(),
    tests: (r) => Array.from({ length: 3 }, () => [rword(r)]) },

  { key: "string-to-lower", title: "To Lowercase", difficulty: "Easy", category: "String",
    functionName: "toLower", params: ["string"], ret: "string",
    desc: "Return the string s converted to lowercase.",
    notes: [],
    fn: (s) => s.toLowerCase(),
    tests: (r) => Array.from({ length: 3 }, () => [rword(r).toUpperCase()]) },

  { key: "count-occurrences", title: "Count Character Occurrences", difficulty: "Easy", category: "String",
    functionName: "countChar", params: ["string", "string"], ret: "int",
    desc: "Return how many times the single character c appears in string s.",
    notes: [],
    fn: (s, c) => s.split("").filter((ch) => ch === c).length,
    tests: (r) => Array.from({ length: 3 }, () => { const w = rword(r); return [w, w[ri(r, 0, w.length - 1)]]; }) },

  { key: "array-contains", title: "Array Contains Value", difficulty: "Easy", category: "Array",
    functionName: "containsValue", params: ["int[]", "int"], ret: "boolean",
    desc: "Return true if target exists in nums, otherwise false.",
    notes: [],
    fn: (nums, target) => nums.includes(target),
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const a = rarr(r, ri(r, 4, 8), 1, 15); out.push([a, t === 0 ? a[0] : ri(r, 16, 30)]); } return out; } },

  { key: "is-power-of-two", title: "Power of Two", difficulty: "Easy", category: "Math - Bit Manipulation",
    functionName: "isPowerOfTwo", params: ["int"], ret: "boolean",
    desc: "Return true if n is a power of two, otherwise false.",
    notes: [],
    fn: (n) => n > 0 && (n & (n - 1)) === 0,
    tests: (r) => [[Math.pow(2, ri(r, 0, 10))], [ri(r, 3, 100)], [ri(r, 1, 1000)]] },

  { key: "digit-sum", title: "Digit Sum", difficulty: "Easy", category: "Math",
    functionName: "digitSum", params: ["int"], ret: "int",
    desc: "Return the sum of the decimal digits of the non-negative integer n.",
    notes: [],
    fn: (n) => String(n).split("").reduce((a, c) => a + Number(c), 0),
    tests: (r) => Array.from({ length: 3 }, () => [ri(r, 0, 99999)]) },

  { key: "count-words", title: "Count Words", difficulty: "Easy", category: "String",
    functionName: "countWords", params: ["string"], ret: "int",
    desc: "Given a sentence s with words separated by single spaces, return the number of words.",
    notes: [],
    fn: (s) => s.trim().split(/\s+/).filter(Boolean).length,
    tests: (r) => Array.from({ length: 3 }, () => [Array.from({ length: ri(r, 1, 5) }, () => rword(r)).join(" ")]) },

  { key: "remove-duplicates-sorted", title: "Remove Duplicates From Sorted Array", difficulty: "Easy", category: "Array - Two Pointers",
    functionName: "dedupeSorted", params: ["int[]"], ret: "int[]",
    desc: "Given a sorted array nums, return the array with duplicates removed, preserving order.",
    notes: [],
    fn: (nums) => [...new Set(nums)],
    tests: (r) => Array.from({ length: 3 }, () => [rsortedArr(r, ri(r, 5, 9), 1, 8)]) },

  { key: "first-non-repeating-char", title: "First Non-Repeating Character Index", difficulty: "Easy", category: "String - Hash Table",
    functionName: "firstUniqChar", params: ["string"], ret: "int",
    desc: "Return the index of the first non-repeating character in s, or -1 if none exists.",
    notes: [],
    fn: (s) => { const counts = {}; for (const c of s) counts[c] = (counts[c] || 0) + 1; for (let i = 0; i < s.length; i++) if (counts[s[i]] === 1) return i; return -1; },
    tests: (r) => ["leetcode", "aabbcc", rword(r) + rword(r)] },

  { key: "is-subsequence", title: "Is Subsequence", difficulty: "Easy", category: "String - Two Pointers",
    functionName: "isSubsequence", params: ["string", "string"], ret: "boolean",
    desc: "Given strings s and t, return true if s is a subsequence of t.",
    notes: [],
    fn: (s, t) => { let i = 0; for (const c of t) { if (i < s.length && s[i] === c) i++; } return i === s.length; },
    tests: (r) => { const t = rword(r) + rword(r); const s = t.split("").filter(() => r() > 0.5).join(""); return [[s, t], ["xyz", t], [t, t]]; } },

  { key: "merge-two-sorted-arrays", title: "Merge Two Sorted Arrays", difficulty: "Easy", category: "Array - Two Pointers",
    functionName: "mergeSorted", params: ["int[]", "int[]"], ret: "int[]",
    desc: "Given two sorted arrays a and b, return a single merged sorted array.",
    notes: [],
    fn: (a, b) => [...a, ...b].sort((x, y) => x - y),
    tests: (r) => Array.from({ length: 3 }, () => [rsortedArr(r, ri(r, 3, 6), 1, 20), rsortedArr(r, ri(r, 3, 6), 1, 20)]) },

  { key: "array-product-except-self-naive", title: "Running Sum of Array", difficulty: "Easy", category: "Array - Prefix Sum",
    functionName: "runningSum", params: ["int[]"], ret: "int[]",
    desc: "Given an array nums, return the running sum where runningSum[i] = sum(nums[0..i]).",
    notes: [],
    fn: (nums) => { const out = []; let s = 0; for (const n of nums) { s += n; out.push(s); } return out; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 4, 8), -5, 10)]) },

  { key: "find-missing-number", title: "Find Missing Number", difficulty: "Easy", category: "Array - Math",
    functionName: "missingNumber", params: ["int[]"], ret: "int",
    desc: "An array nums contains n distinct numbers from 0 to n (one missing). Return the missing number.",
    notes: [],
    fn: (nums) => { const n = nums.length; const total = (n * (n + 1)) / 2; return total - nums.reduce((a, b) => a + b, 0); },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const n = ri(r, 5, 9); const full = Array.from({ length: n + 1 }, (_, i) => i); const missIdx = ri(r, 0, n); full.splice(missIdx, 1); out.push([full]); } return out; } },

  { key: "single-number", title: "Single Number", difficulty: "Easy", category: "Array - Bit Manipulation",
    functionName: "singleNumber", params: ["int[]"], ret: "int",
    desc: "Every element in nums appears twice except for one. Return that single one.",
    notes: [],
    fn: (nums) => nums.reduce((a, b) => a ^ b, 0),
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const pairs = rarr(r, ri(r, 3, 5), 1, 20); const arr = [...pairs, ...pairs, ri(r, 21, 40)].sort(() => r() - 0.5); out.push([arr]); } return out; } },

  { key: "is-armstrong", title: "Armstrong Number Check", difficulty: "Easy", category: "Math",
    functionName: "isArmstrong", params: ["int"], ret: "boolean",
    desc: "Return true if n equals the sum of its own digits each raised to the power of the number of digits.",
    notes: [],
    fn: (n) => { const d = String(n).split(""); const p = d.length; return d.reduce((a, c) => a + Math.pow(Number(c), p), 0) === n; },
    tests: (r) => [[153], [ri(r, 100, 999)], [9474]] },

  { key: "count-set-bits", title: "Count Set Bits", difficulty: "Easy", category: "Bit Manipulation",
    functionName: "countSetBits", params: ["int"], ret: "int",
    desc: "Return the number of 1 bits in the binary representation of n.",
    notes: [],
    fn: (n) => n.toString(2).split("").filter((b) => b === "1").length,
    tests: (r) => Array.from({ length: 3 }, () => [ri(r, 0, 1023)]) },

  { key: "string-compression-count", title: "Run-Length Count", difficulty: "Easy", category: "String",
    functionName: "runLength", params: ["string"], ret: "string",
    desc: "Given a string s of repeated characters (e.g. 'aaabb'), return its run-length encoding (e.g. 'a3b2').",
    notes: [],
    fn: (s) => { let res = ""; let i = 0; while (i < s.length) { let j = i; while (j < s.length && s[j] === s[i]) j++; res += s[i] + (j - i); i = j; } return res; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { let s = ""; for (let k = 0; k < ri(r, 2, 4); k++) s += String.fromCharCode(97 + ri(r, 0, 4)).repeat(ri(r, 1, 4)); out.push([s]); } return out; } },

  { key: "rotate-string-check", title: "Rotated String Check", difficulty: "Easy", category: "String",
    functionName: "isRotation", params: ["string", "string"], ret: "boolean",
    desc: "Return true if string b is a rotation of string a (same length, can be formed by rotating a).",
    notes: [],
    fn: (a, b) => a.length === b.length && (a + a).includes(b),
    tests: (r) => { const a = rword(r); const k = ri(r, 1, a.length - 1); const rotated = a.slice(k) + a.slice(0, k); return [[a, rotated], [a, rword(r)], [a, a]]; } },

  { key: "find-duplicates-array", title: "Has Duplicate", difficulty: "Easy", category: "Array - Hash Table",
    functionName: "hasDuplicate", params: ["int[]"], ret: "boolean",
    desc: "Return true if any value appears at least twice in nums.",
    notes: [],
    fn: (nums) => new Set(nums).size !== nums.length,
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const a = rarr(r, ri(r, 4, 7), 1, 6); out.push([a]); } return out; } },

  { key: "average-of-evens", title: "Sum of Even Numbers", difficulty: "Easy", category: "Array",
    functionName: "sumEven", params: ["int[]"], ret: "int",
    desc: "Return the sum of all even numbers in nums.",
    notes: [],
    fn: (nums) => nums.filter((x) => x % 2 === 0).reduce((a, b) => a + b, 0),
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), -10, 20)]) },

  { key: "capitalize-words", title: "Capitalize Each Word", difficulty: "Easy", category: "String",
    functionName: "capitalizeWords", params: ["string"], ret: "string",
    desc: "Given a sentence s with words separated by single spaces, capitalize the first letter of each word.",
    notes: [],
    fn: (s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    tests: (r) => Array.from({ length: 3 }, () => [Array.from({ length: ri(r, 2, 4) }, () => rword(r)).join(" ")]) },

  // =================== MEDIUM (40) ===================
  { key: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium", category: "Dynamic Programming",
    functionName: "maxSubArray", params: ["int[]"], ret: "int",
    desc: "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.",
    notes: ["Use Kadane's algorithm for O(n)."],
    fn: (nums) => { let best = nums[0], cur = nums[0]; for (let i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); best = Math.max(best, cur); } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), -8, 9)]) },

  { key: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium", category: "Two Pointers",
    functionName: "maxArea", params: ["int[]"], ret: "int",
    desc: "Given heights, find two lines that together with the x-axis form a container holding the most water. Return the max area.",
    notes: [],
    fn: (h) => { let l = 0, r = h.length - 1, best = 0; while (l < r) { best = Math.max(best, Math.min(h[l], h[r]) * (r - l)); if (h[l] < h[r]) l++; else r--; } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), 1, 12)]) },

  { key: "move-zeroes", title: "Move Zeroes", difficulty: "Medium", category: "Array - Two Pointers",
    functionName: "moveZeroes", params: ["int[]"], ret: "int[]",
    desc: "Move all 0's to the end of nums while keeping the relative order of non-zero elements. Return the resulting array.",
    notes: [],
    fn: (nums) => { const nz = nums.filter((x) => x !== 0); const zeros = nums.length - nz.length; return nz.concat(Array(zeros).fill(0)); },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), 0, 4)]) },

  { key: "rotate-array", title: "Rotate Array", difficulty: "Medium", category: "Array",
    functionName: "rotate", params: ["int[]", "int"], ret: "int[]",
    desc: "Rotate the array nums to the right by k steps and return the result.",
    notes: ["k may be larger than the array length."],
    fn: (nums, k) => { const n = nums.length; k %= n; return nums.slice(n - k).concat(nums.slice(0, n - k)); },
    tests: (r) => Array.from({ length: 3 }, () => { const a = rarr(r, ri(r, 4, 7), 1, 20); return [a, ri(r, 1, 9)]; }) },

  { key: "binary-search", title: "Binary Search", difficulty: "Medium", category: "Search",
    functionName: "binarySearch", params: ["int[]", "int"], ret: "int",
    desc: "Given a sorted ascending array nums and a target, return its index or -1 if absent.",
    notes: ["Run in O(log n)."],
    fn: (nums, target) => { let lo = 0, hi = nums.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (nums[m] === target) return m; if (nums[m] < target) lo = m + 1; else hi = m - 1; } return -1; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const a = Array.from({ length: ri(r, 5, 9) }, (_, i) => i * ri(r, 1, 3) + ri(r, 0, 2)).sort((x, y) => x - y); out.push([a, t === 0 ? a[ri(r, 0, a.length - 1)] : ri(r, 50, 80)]); } return out; } },

  { key: "second-largest", title: "Second Largest", difficulty: "Medium", category: "Array",
    functionName: "secondLargest", params: ["int[]"], ret: "int",
    desc: "Return the second largest distinct value in nums, or -1 if it does not exist.",
    notes: [],
    fn: (nums) => { const u = [...new Set(nums)].sort((a, b) => b - a); return u.length >= 2 ? u[1] : -1; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 4, 8), 1, 30)]) },

  { key: "is-anagram", title: "Valid Anagram", difficulty: "Medium", category: "String - Hash Table",
    functionName: "isAnagram", params: ["string", "string"], ret: "boolean",
    desc: "Given two strings s and t, return true if t is an anagram of s.",
    notes: [],
    fn: (s, t) => s.split("").sort().join("") === t.split("").sort().join(""),
    tests: (r) => { const w = rword(r); return [[w, w.split("").reverse().join("")], [rword(r), rword(r)], [w, w]]; } },

  { key: "count-distinct", title: "Count Distinct Elements", difficulty: "Medium", category: "Hash Table",
    functionName: "countDistinct", params: ["int[]"], ret: "int",
    desc: "Return the number of distinct values in nums.",
    notes: [],
    fn: (nums) => new Set(nums).size,
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), 1, 6)]) },

  { key: "longest-substring-without-repeat-length", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Sliding Window",
    functionName: "lengthOfLongestSubstring", params: ["string"], ret: "int",
    desc: "Given a string s, return the length of the longest substring without repeating characters.",
    notes: [],
    fn: (s) => { let l = 0, best = 0; const seen = new Map(); for (let r2 = 0; r2 < s.length; r2++) { const c = s[r2]; if (seen.has(c) && seen.get(c) >= l) l = seen.get(c) + 1; seen.set(c, r2); best = Math.max(best, r2 - l + 1); } return best; },
    tests: (r) => ["abcabcbb", "bbbbb", rword(r) + rword(r)] },

  { key: "group-anagrams-count", title: "Count Anagram Groups", difficulty: "Medium", category: "Hash Table",
    functionName: "countAnagramGroups", params: ["string[]"], ret: "int",
    desc: "Given an array of strings, return the number of distinct anagram groups.",
    notes: [],
    fn: (strs) => new Set(strs.map((s) => s.split("").sort().join(""))).size,
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const base = [rword(r), rword(r)]; const arr = base.flatMap((w) => [w, w.split("").sort().join("").split("").sort(() => r() - 0.5).join("")]); out.push([arr]); } return out; } },

  { key: "three-sum-exists", title: "Three Sum Exists", difficulty: "Medium", category: "Array - Two Pointers",
    functionName: "threeSumExists", params: ["int[]", "int"], ret: "boolean",
    desc: "Given an array nums and target, return true if there exist three distinct indices whose values sum to target.",
    notes: [],
    fn: (nums, target) => { const a = [...nums].sort((x, y) => x - y); for (let i = 0; i < a.length - 2; i++) { let l = i + 1, r = a.length - 1; while (l < r) { const s = a[i] + a[l] + a[r]; if (s === target) return true; if (s < target) l++; else r--; } } return false; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const a = rarr(r, ri(r, 5, 8), -10, 10); const i = ri(r, 0, a.length - 3), j = ri(r, i + 1, a.length - 2), k = ri(r, j + 1, a.length - 1); out.push([a, t === 0 ? a[i] + a[j] + a[k] : ri(r, 100, 200)]); } return out; } },

  { key: "longest-common-prefix", title: "Longest Common Prefix", difficulty: "Medium", category: "String",
    functionName: "longestCommonPrefix", params: ["string[]"], ret: "string",
    desc: "Given an array of strings, return the longest common prefix among them, or empty string if none.",
    notes: [],
    fn: (strs) => { if (!strs.length) return ""; let prefix = strs[0]; for (const s of strs.slice(1)) { while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1); } return prefix; },
    tests: (r) => { const pre = rword(r).slice(0, 3); return [[[pre + "abc", pre + "xyz", pre + "qrs"]], [["flower", "flow", "flight"]], [[rword(r), rword(r)]]]; } },

  { key: "majority-element", title: "Majority Element", difficulty: "Medium", category: "Array - Hash Table",
    functionName: "majorityElement", params: ["int[]"], ret: "int",
    desc: "Given an array nums of size n, return the element that appears more than n/2 times.",
    notes: [],
    fn: (nums) => { const counts = new Map(); for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1); let best = nums[0], bc = 0; for (const [k, v] of counts) if (v > bc) { best = k; bc = v; } return best; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const maj = ri(r, 1, 10); const arr = Array(ri(r, 3, 5)).fill(maj).concat(rarr(r, ri(r, 1, 3), 11, 20)).sort(() => r() - 0.5); out.push([arr]); } return out; } },

  { key: "plus-one", title: "Plus One", difficulty: "Medium", category: "Array - Math",
    functionName: "plusOne", params: ["int[]"], ret: "int[]",
    desc: "Given digits representing a non-negative integer (most significant digit first), increment by one and return the new digit array.",
    notes: [],
    fn: (digits) => { const n = Number(digits.join("")) + 1; return String(n).split("").map(Number); },
    tests: (r) => [[[1, 2, 3]], [[9, 9]], [rarr(r, ri(r, 2, 4), 0, 8)]] },

  { key: "spiral-sum", title: "Pair Sum Closest to Zero", difficulty: "Medium", category: "Array - Two Pointers",
    functionName: "closestToZeroSum", params: ["int[]"], ret: "int",
    desc: "Given an array of integers, return the sum of the pair whose sum is closest to zero (array has at least 2 elements).",
    notes: [],
    fn: (nums) => { const a = [...nums].sort((x, y) => x - y); let l = 0, r = a.length - 1, best = a[0] + a[a.length - 1]; while (l < r) { const s = a[l] + a[r]; if (Math.abs(s) < Math.abs(best)) best = s; if (s < 0) l++; else r--; } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), -15, 15)]) },

  { key: "is-valid-parentheses", title: "Valid Parentheses", difficulty: "Medium", category: "Stack",
    functionName: "isValidParens", params: ["string"], ret: "boolean",
    desc: "Given a string s containing just '()[]{}', determine if the input string is valid (properly matched and nested).",
    notes: [],
    fn: (s) => { const stack = []; const map = { ")": "(", "]": "[", "}": "{" }; for (const c of s) { if ("([{".includes(c)) stack.push(c); else { if (stack.pop() !== map[c]) return false; } } return stack.length === 0; },
    tests: (r) => ["()[]{}", "(]", "{[]}" ] },

  { key: "decode-run-length", title: "Decode Run-Length String", difficulty: "Medium", category: "String",
    functionName: "decodeRunLength", params: ["string"], ret: "string",
    desc: "Given a run-length-encoded string like 'a3b2', decode it back to the original repeated string 'aaabb'.",
    notes: [],
    fn: (s) => { let res = ""; for (let i = 0; i < s.length; i += 2) { res += s[i].repeat(Number(s[i + 1])); } return res; },
    tests: (r) => ["a3b2", "x1y4z2", `${String.fromCharCode(97 + ri(r, 0, 5))}${ri(r, 1, 5)}`] },

  { key: "kth-largest", title: "Kth Largest Element", difficulty: "Medium", category: "Sorting",
    functionName: "kthLargest", params: ["int[]", "int"], ret: "int",
    desc: "Given an integer array nums and integer k, return the kth largest element in the array.",
    notes: [],
    fn: (nums, k) => [...nums].sort((a, b) => b - a)[k - 1],
    tests: (r) => Array.from({ length: 3 }, () => { const a = rarr(r, ri(r, 5, 9), 1, 30); return [a, ri(r, 1, a.length)]; }) },

  { key: "merge-intervals-count", title: "Count Merged Intervals", difficulty: "Medium", category: "Array - Sorting",
    functionName: "countMergedIntervals", params: ["int[]"], ret: "int",
    desc: "Given a flat array of [start1,end1,start2,end2,...] interval pairs, return the number of intervals after merging all overlapping ones.",
    notes: [],
    fn: (flat) => { const pairs = []; for (let i = 0; i < flat.length; i += 2) pairs.push([flat[i], flat[i + 1]]); pairs.sort((a, b) => a[0] - b[0]); let count = 0; let curEnd = -Infinity; for (const [s, e] of pairs) { if (s > curEnd) { count++; curEnd = e; } else curEnd = Math.max(curEnd, e); } return count; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const flat = []; let start = 0; for (let k = 0; k < ri(r, 3, 5); k++) { start += ri(r, 0, 3); const end = start + ri(r, 1, 4); flat.push(start, end); start = end; } out.push([flat]); } return out; } },

  { key: "max-consecutive-ones", title: "Max Consecutive Ones", difficulty: "Medium", category: "Array - Sliding Window",
    functionName: "maxConsecutiveOnes", params: ["int[]"], ret: "int",
    desc: "Given a binary array nums (0s and 1s), return the maximum number of consecutive 1's.",
    notes: [],
    fn: (nums) => { let best = 0, cur = 0; for (const n of nums) { cur = n === 1 ? cur + 1 : 0; best = Math.max(best, cur); } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 6, 10), 0, 1)]) },

  { key: "product-except-self", title: "Product of Array Except Self", difficulty: "Medium", category: "Array - Prefix Product",
    functionName: "productExceptSelf", params: ["int[]"], ret: "int[]",
    desc: "Given an array nums, return an array where output[i] equals the product of all elements except nums[i].",
    notes: [],
    fn: (nums) => nums.map((_, i) => nums.reduce((acc, v, j) => (j === i ? acc : acc * v), 1)),
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 4, 6), 1, 6)]) },

  { key: "find-peak-index", title: "Find Peak Element Index", difficulty: "Medium", category: "Array - Binary Search",
    functionName: "findPeakIndex", params: ["int[]"], ret: "int",
    desc: "Given an array nums that strictly increases then strictly decreases, return the index of the peak element.",
    notes: [],
    fn: (nums) => nums.indexOf(Math.max(...nums)),
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const peak = ri(r, 4, 6); const up = Array.from({ length: peak }, (_, i) => i + 1); const down = Array.from({ length: ri(r, 2, 4) }, (_, i) => peak - i); out.push([up.concat(down)]); } return out; } },

  { key: "string-permutation-check", title: "Permutation Check", difficulty: "Medium", category: "String - Hash Table",
    functionName: "isPermutation", params: ["string", "string"], ret: "boolean",
    desc: "Return true if string b is a permutation (anagram) of string a.",
    notes: [],
    fn: (a, b) => a.length === b.length && a.split("").sort().join("") === b.split("").sort().join(""),
    tests: (r) => { const w = rword(r); return [[w, w.split("").sort(() => r() - 0.5).join("")], [w, rword(r)], [w, w]]; } },

  { key: "max-profit-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Medium", category: "Dynamic Programming",
    functionName: "maxProfit", params: ["int[]"], ret: "int",
    desc: "Given prices where prices[i] is the price on day i, return the maximum profit from one buy and one later sell, or 0.",
    notes: [],
    fn: (p) => { let min = p[0], best = 0; for (let i = 1; i < p.length; i++) { best = Math.max(best, p[i] - min); min = Math.min(min, p[i]); } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 6, 10), 1, 30)]) },

  { key: "search-insert-position", title: "Search Insert Position", difficulty: "Medium", category: "Binary Search",
    functionName: "searchInsert", params: ["int[]", "int"], ret: "int",
    desc: "Given a sorted array nums and a target, return the index where target is found, or where it would be inserted in order.",
    notes: [],
    fn: (nums, target) => { let lo = 0, hi = nums.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nums[m] < target) lo = m + 1; else hi = m; } return lo; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const a = rsortedArr(r, ri(r, 5, 8), 1, 5).map((x, i) => x + i * 2); out.push([a, ri(r, 0, 40)]); } return out; } },

  { key: "max-subarray-length-k-sum", title: "Subarray Sum Equals K (count)", difficulty: "Medium", category: "Prefix Sum - Hash Table",
    functionName: "subarraySumCount", params: ["int[]", "int"], ret: "int",
    desc: "Given an array nums and integer k, return the total number of contiguous subarrays whose sum equals k.",
    notes: [],
    fn: (nums, k) => { let count = 0, sum = 0; const map = new Map([[0, 1]]); for (const n of nums) { sum += n; count += map.get(sum - k) || 0; map.set(sum, (map.get(sum) || 0) + 1); } return count; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), -3, 5), ri(r, 1, 6)]) },

  { key: "valid-mountain-array", title: "Valid Mountain Array", difficulty: "Medium", category: "Array",
    functionName: "isMountainArray", params: ["int[]"], ret: "boolean",
    desc: "Return true if nums forms a mountain array: strictly increasing then strictly decreasing, with at least one element on each side of the peak.",
    notes: [],
    fn: (a) => { let i = 0, n = a.length; while (i + 1 < n && a[i] < a[i + 1]) i++; if (i === 0 || i === n - 1) return false; while (i + 1 < n && a[i] > a[i + 1]) i++; return i === n - 1; },
    tests: (r) => { const peak = ri(r, 3, 5); const up = Array.from({ length: peak }, (_, i) => i + 1); const down = Array.from({ length: ri(r, 2, 4) }, (_, i) => peak - i); return [[up.concat(down)], [[1, 2, 3, 4, 5]], [rarr(r, ri(r, 4, 6), 1, 5)]]; } },

  { key: "max-gap-sorted", title: "Maximum Gap", difficulty: "Medium", category: "Array - Sorting",
    functionName: "maxGap", params: ["int[]"], ret: "int",
    desc: "Given an unsorted array nums, return the maximum difference between two successive elements in its sorted form.",
    notes: [],
    fn: (nums) => { const a = [...nums].sort((x, y) => x - y); let best = 0; for (let i = 1; i < a.length; i++) best = Math.max(best, a[i] - a[i - 1]); return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), 1, 50)]) },

  { key: "first-missing-positive-small", title: "First Missing Positive", difficulty: "Medium", category: "Array - Hash Table",
    functionName: "firstMissingPositive", params: ["int[]"], ret: "int",
    desc: "Given an unsorted array nums, return the smallest missing positive integer.",
    notes: [],
    fn: (nums) => { const s = new Set(nums); let i = 1; while (s.has(i)) i++; return i; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 4, 8), -3, 8)]) },

  { key: "string-to-integer-atoi-simple", title: "String to Integer (simple atoi)", difficulty: "Medium", category: "String",
    functionName: "myAtoi", params: ["string"], ret: "int",
    desc: "Convert a numeric string s (optional leading +/- and digits, no whitespace) to an integer.",
    notes: [],
    fn: (s) => parseInt(s, 10) || 0,
    tests: (r) => [["42"], ["-123"], [String(ri(r, -999, 999))]] },

  { key: "longest-palindromic-substring-length", title: "Longest Palindromic Substring Length", difficulty: "Medium", category: "String - Dynamic Programming",
    functionName: "longestPalindromeLength", params: ["string"], ret: "int",
    desc: "Given a string s, return the length of the longest palindromic substring.",
    notes: [],
    fn: (s) => { let best = 0; const expand = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; } return r - l - 1; }; for (let i = 0; i < s.length; i++) { best = Math.max(best, expand(i, i), expand(i, i + 1)); } return best; },
    tests: (r) => ["babad", "cbbd", rword(r)] },

  { key: "zigzag-sum", title: "Alternating Sum", difficulty: "Medium", category: "Array",
    functionName: "alternatingSum", params: ["int[]"], ret: "int",
    desc: "Given an array nums, return the alternating sum: nums[0] - nums[1] + nums[2] - ...",
    notes: [],
    fn: (nums) => nums.reduce((acc, v, i) => acc + (i % 2 === 0 ? v : -v), 0),
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), -10, 10)]) },

  { key: "kadane-with-indices-len", title: "Length of Maximum Sum Subarray", difficulty: "Medium", category: "Dynamic Programming",
    functionName: "maxSumSubarrayLength", params: ["int[]"], ret: "int",
    desc: "Given an integer array nums, return the length of the contiguous subarray with the largest sum.",
    notes: [],
    fn: (nums) => { let best = nums[0], cur = nums[0], bestLen = 1, curStart = 0, bestStart = 0; for (let i = 1; i < nums.length; i++) { if (cur + nums[i] >= nums[i]) { cur += nums[i]; } else { cur = nums[i]; curStart = i; } if (cur > best) { best = cur; bestStart = curStart; bestLen = i - bestStart + 1; } } return bestLen; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), -8, 9)]) },

  { key: "is-balanced-bracket-depth", title: "Max Bracket Depth", difficulty: "Medium", category: "Stack",
    functionName: "maxDepth", params: ["string"], ret: "int",
    desc: "Given a valid parentheses string s, return the maximum nesting depth.",
    notes: [],
    fn: (s) => { let depth = 0, best = 0; for (const c of s) { if (c === "(") { depth++; best = Math.max(best, depth); } else if (c === ")") depth--; } return best; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { let s = ""; let open = 0; for (let k = 0; k < ri(r, 4, 8); k++) { if (open > 0 && r() < 0.4) { s += ")"; open--; } else { s += "("; open++; } } s += ")".repeat(open); out.push([s]); } return out; } },

  { key: "min-cost-to-equalize", title: "Min Operations to Make Equal", difficulty: "Medium", category: "Array - Math",
    functionName: "minOpsToEqual", params: ["int[]"], ret: "int",
    desc: "Given an array nums, return the minimum number of increment operations to make all elements equal to the max value (each op adds 1 to one element).",
    notes: [],
    fn: (nums) => { const max = Math.max(...nums); return nums.reduce((acc, v) => acc + (max - v), 0); },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 4, 7), 1, 20)]) },

  { key: "find-all-pairs-equal-sum", title: "Count Pairs With Given Sum", difficulty: "Medium", category: "Array - Hash Table",
    functionName: "countPairsWithSum", params: ["int[]", "int"], ret: "int",
    desc: "Given an array nums and integer target, return the count of index pairs (i<j) where nums[i]+nums[j]==target.",
    notes: [],
    fn: (nums, target) => { let count = 0; for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) if (nums[i] + nums[j] === target) count++; return count; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), 1, 10), ri(r, 5, 15)]) },

  { key: "string-rotation-min", title: "Lexicographically Smallest Rotation", difficulty: "Medium", category: "String",
    functionName: "smallestRotation", params: ["string"], ret: "string",
    desc: "Given a string s, return its lexicographically smallest rotation.",
    notes: [],
    fn: (s) => { let best = s; for (let i = 1; i < s.length; i++) { const rot = s.slice(i) + s.slice(0, i); if (rot < best) best = rot; } return best; },
    tests: (r) => ["bca", "banana", rword(r)] },

  { key: "max-water-trapped-simple", title: "Trap Rain Water (1D, simple)", difficulty: "Medium", category: "Array - Two Pointers",
    functionName: "trapSimple", params: ["int[]"], ret: "int",
    desc: "Given heights, compute how much water can be trapped between bars after raining.",
    notes: [],
    fn: (h) => { let l = 0, r = h.length - 1, lm = 0, rm = 0, res = 0; while (l < r) { if (h[l] < h[r]) { lm = Math.max(lm, h[l]); res += lm - h[l]; l++; } else { rm = Math.max(rm, h[r]); res += rm - h[r]; r--; } } return res; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 6, 10), 0, 6)]) },

  { key: "max-length-equal-01", title: "Longest Equal 0s and 1s Subarray", difficulty: "Medium", category: "Hash Table - Prefix Sum",
    functionName: "maxLenEqual01", params: ["int[]"], ret: "int",
    desc: "Given a binary array nums, return the length of the longest contiguous subarray with an equal number of 0s and 1s.",
    notes: [],
    fn: (nums) => { let sum = 0, best = 0; const seen = new Map([[0, -1]]); for (let i = 0; i < nums.length; i++) { sum += nums[i] === 0 ? -1 : 1; if (seen.has(sum)) best = Math.max(best, i - seen.get(sum)); else seen.set(sum, i); } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 6, 10), 0, 1)]) },

  { key: "min-window-distinct-chars", title: "Count Distinct Substrings of Length K", difficulty: "Medium", category: "Sliding Window - Hash Table",
    functionName: "countDistinctSubstringsOfLengthK", params: ["string", "int"], ret: "int",
    desc: "Given a string s and integer k, return the number of distinct substrings of length k.",
    notes: [],
    fn: (s, k) => { const set = new Set(); for (let i = 0; i + k <= s.length; i++) set.add(s.slice(i, i + k)); return set.size; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const w = rword(r) + rword(r); out.push([w, ri(r, 2, 4)]); } return out; } },

  // =================== HARD (20) ===================
  { key: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", category: "Two Pointers - DP",
    functionName: "trap", params: ["int[]"], ret: "int",
    desc: "Given an elevation map height, compute how much water it can trap after raining.",
    notes: [],
    fn: (h) => { let l = 0, r = h.length - 1, lm = 0, rm = 0, res = 0; while (l < r) { if (h[l] < h[r]) { lm = Math.max(lm, h[l]); res += lm - h[l]; l++; } else { rm = Math.max(rm, h[r]); res += rm - h[r]; r--; } } return res; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 6, 10), 0, 6)]) },

  { key: "coin-change", title: "Coin Change", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "coinChange", params: ["int[]", "int"], ret: "int",
    desc: "Given coin denominations coins and an amount, return the fewest coins needed to make the amount, or -1.",
    notes: ["You may use each coin unlimited times."],
    fn: (coins, amount) => { const dp = Array(amount + 1).fill(Infinity); dp[0] = 0; for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1); return dp[amount] === Infinity ? -1 : dp[amount]; },
    tests: (r) => Array.from({ length: 3 }, () => { const coins = [1, ri(r, 2, 4), ri(r, 5, 9)]; return [coins, ri(r, 6, 25)]; }) },

  { key: "lis", title: "Longest Increasing Subsequence", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "lengthOfLIS", params: ["int[]"], ret: "int",
    desc: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    notes: [],
    fn: (nums) => { const dp = Array(nums.length).fill(1); let best = 1; for (let i = 1; i < nums.length; i++) for (let j = 0; j < i; j++) if (nums[j] < nums[i]) { dp[i] = Math.max(dp[i], dp[j] + 1); best = Math.max(best, dp[i]); } return nums.length ? best : 0; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 6, 10), 1, 20)]) },

  { key: "edit-distance", title: "Edit Distance", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "editDistance", params: ["string", "string"], ret: "int",
    desc: "Given two strings word1 and word2, return the minimum number of insert/delete/replace operations to convert word1 to word2.",
    notes: [],
    fn: (a, b) => { const m = a.length, n = b.length; const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0)); for (let i = 0; i <= m; i++) dp[i][0] = i; for (let j = 0; j <= n; j++) dp[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) { if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1]; else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]); } return dp[m][n]; },
    tests: (r) => ["horse", "ros", rword(r)].map((w, i) => i === 2 ? [w, rword(r)] : [w, ["ros", "horse"][i]]) },

  { key: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "longestCommonSubsequence", params: ["string", "string"], ret: "int",
    desc: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    notes: [],
    fn: (a, b) => { const m = a.length, n = b.length; const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0)); for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]); return dp[m][n]; },
    tests: (r) => [["abcde", "ace"], ["abc", "abc"], [rword(r), rword(r)]] },

  { key: "max-product-subarray", title: "Maximum Product Subarray", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "maxProduct", params: ["int[]"], ret: "int",
    desc: "Given an integer array nums, find the contiguous subarray with the largest product and return that product.",
    notes: [],
    fn: (nums) => { let maxP = nums[0], minP = nums[0], best = nums[0]; for (let i = 1; i < nums.length; i++) { const n = nums[i]; const candidates = [n, maxP * n, minP * n]; maxP = Math.max(...candidates); minP = Math.min(...candidates); best = Math.max(best, maxP); } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), -4, 4)]) },

  { key: "word-break-possible", title: "Word Break", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "wordBreak", params: ["string", "string[]"], ret: "boolean",
    desc: "Given a string s and a dictionary wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.",
    notes: [],
    fn: (s, wordDict) => { const set = new Set(wordDict); const dp = Array(s.length + 1).fill(false); dp[0] = true; for (let i = 1; i <= s.length; i++) for (let j = 0; j < i; j++) if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; } return dp[s.length]; },
    tests: (r) => [["leetcode", ["leet", "code"]], ["applepenapple", ["apple", "pen"]], ["catsandog", ["cats", "dog", "sand", "and", "cat"]]] },

  { key: "unique-paths-grid", title: "Unique Paths", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "uniquePaths", params: ["int", "int"], ret: "int",
    desc: "A robot starts at the top-left of an m x n grid and can move only right or down. Return the number of unique paths to the bottom-right.",
    notes: [],
    fn: (m, n) => { const dp = Array.from({ length: m }, () => Array(n).fill(1)); for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) dp[i][j] = dp[i - 1][j] + dp[i][j - 1]; return dp[m - 1][n - 1]; },
    tests: (r) => Array.from({ length: 3 }, () => [ri(r, 2, 6), ri(r, 2, 6)]) },

  { key: "house-robber", title: "House Robber", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "rob", params: ["int[]"], ret: "int",
    desc: "Given an array nums of money in each house (no two adjacent houses can be robbed), return the maximum amount you can rob.",
    notes: [],
    fn: (nums) => { let prev = 0, cur = 0; for (const n of nums) { const tmp = Math.max(cur, prev + n); prev = cur; cur = tmp; } return cur; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), 1, 30)]) },

  { key: "decode-ways-count", title: "Decode Ways", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "numDecodings", params: ["string"], ret: "int",
    desc: "A digit string s can be decoded as letters A-Z (1-26). Return the number of ways to decode it.",
    notes: [],
    fn: (s) => { const n = s.length; if (n === 0 || s[0] === "0") return 0; const dp = Array(n + 1).fill(0); dp[0] = 1; dp[1] = 1; for (let i = 2; i <= n; i++) { if (s[i - 1] !== "0") dp[i] += dp[i - 1]; const two = Number(s.slice(i - 2, i)); if (two >= 10 && two <= 26) dp[i] += dp[i - 2]; } return dp[n]; },
    tests: (r) => ["12", "226", String(ri(r, 11, 26)) + String(ri(r, 1, 9))] },

  { key: "min-path-sum-grid", title: "Minimum Path Sum (flattened grid)", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "minPathSum", params: ["int[]", "int"], ret: "int",
    desc: "Given a flattened row-major grid array and the number of columns, return the minimum sum path from top-left to bottom-right moving only right or down.",
    notes: [],
    fn: (flat, cols) => { const rows = flat.length / cols; const grid = []; for (let i = 0; i < rows; i++) grid.push(flat.slice(i * cols, i * cols + cols)); const dp = Array.from({ length: rows }, () => Array(cols).fill(0)); for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { if (i === 0 && j === 0) dp[i][j] = grid[i][j]; else if (i === 0) dp[i][j] = dp[i][j - 1] + grid[i][j]; else if (j === 0) dp[i][j] = dp[i - 1][j] + grid[i][j]; else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]; } return dp[rows - 1][cols - 1]; },
    tests: (r) => Array.from({ length: 3 }, () => { const cols = ri(r, 2, 4); const rows = ri(r, 2, 4); return [rarr(r, rows * cols, 1, 9), cols]; }) },

  { key: "max-sum-non-adjacent", title: "Max Sum of Non-Adjacent Elements", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "maxSumNonAdjacent", params: ["int[]"], ret: "int",
    desc: "Given an array nums, return the maximum sum of a subset of elements with no two adjacent indices chosen.",
    notes: [],
    fn: (nums) => { let incl = 0, excl = 0; for (const n of nums) { const newIncl = excl + n; excl = Math.max(excl, incl); incl = newIncl; } return Math.max(incl, excl); },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), 1, 20)]) },

  { key: "min-jumps-to-end", title: "Minimum Jumps to Reach End", difficulty: "Hard", category: "Greedy - DP",
    functionName: "minJumps", params: ["int[]"], ret: "int",
    desc: "Given an array nums where nums[i] is the max jump length from index i, return the minimum number of jumps to reach the last index.",
    notes: ["Assume it's always possible to reach the end."],
    fn: (nums) => { let jumps = 0, curEnd = 0, farthest = 0; for (let i = 0; i < nums.length - 1; i++) { farthest = Math.max(farthest, i + nums[i]); if (i === curEnd) { jumps++; curEnd = farthest; } } return jumps; },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const n = ri(r, 5, 8); const arr = Array.from({ length: n }, () => ri(r, 1, 3)); arr[n - 1] = 0; out.push([arr]); } return out; } },

  { key: "partition-equal-subset", title: "Partition Equal Subset Sum", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "canPartition", params: ["int[]"], ret: "boolean",
    desc: "Given an array nums, return true if it can be partitioned into two subsets with equal sum.",
    notes: [],
    fn: (nums) => { const total = nums.reduce((a, b) => a + b, 0); if (total % 2 !== 0) return false; const target = total / 2; const dp = new Set([0]); for (const n of nums) { const next = new Set(dp); for (const s of dp) if (s + n <= target) next.add(s + n); dp.clear(); for (const v of next) dp.add(v); } return dp.has(target); },
    tests: (r) => { const out = []; for (let t = 0; t < 3; t++) { const half = rarr(r, ri(r, 2, 4), 1, 10); out.push([half.concat(half)]); } return out; } },

  { key: "longest-palindromic-subsequence", title: "Longest Palindromic Subsequence", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "longestPalinSubsequence", params: ["string"], ret: "int",
    desc: "Given a string s, return the length of the longest palindromic subsequence.",
    notes: [],
    fn: (s) => { const n = s.length; const dp = Array.from({ length: n }, () => Array(n).fill(0)); for (let i = n - 1; i >= 0; i--) { dp[i][i] = 1; for (let j = i + 1; j < n; j++) { dp[i][j] = s[i] === s[j] ? dp[i + 1][j - 1] + 2 : Math.max(dp[i + 1][j], dp[i][j - 1]); } } return n ? dp[0][n - 1] : 0; },
    tests: (r) => ["bbbab", "cbbd", rword(r)] },

  { key: "max-area-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard", category: "Stack",
    functionName: "largestRectangleArea", params: ["int[]"], ret: "int",
    desc: "Given an array of bar heights forming a histogram, return the area of the largest rectangle that fits within the histogram.",
    notes: [],
    fn: (heights) => { const stack = []; let best = 0; for (let i = 0; i <= heights.length; i++) { const h = i === heights.length ? 0 : heights[i]; while (stack.length && heights[stack[stack.length - 1]] >= h) { const height = heights[stack.pop()]; const width = stack.length ? i - stack[stack.length - 1] - 1 : i; best = Math.max(best, height * width); } stack.push(i); } return best; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), 1, 10)]) },

  { key: "min-coins-greedy-dp", title: "Combination Sum Count", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "combinationSumCount", params: ["int[]", "int"], ret: "int",
    desc: "Given distinct positive integers nums and a target, return the number of distinct combinations (order doesn't matter, unlimited reuse) that sum to target.",
    notes: [],
    fn: (nums, target) => { const dp = Array(target + 1).fill(0); dp[0] = 1; for (const n of nums) for (let t = n; t <= target; t++) dp[t] += dp[t - n]; return dp[target]; },
    tests: (r) => Array.from({ length: 3 }, () => [[1, ri(r, 2, 3), ri(r, 4, 5)], ri(r, 6, 12)]) },

  { key: "max-subarray-sum-circular", title: "Maximum Circular Subarray Sum", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "maxSubarraySumCircular", params: ["int[]"], ret: "int",
    desc: "Given a circular integer array nums, return the maximum possible sum of a non-empty subarray (may wrap around).",
    notes: [],
    fn: (nums) => { const kadeneMax = (a) => { let best = a[0], cur = a[0]; for (let i = 1; i < a.length; i++) { cur = Math.max(a[i], cur + a[i]); best = Math.max(best, cur); } return best; }; const total = nums.reduce((a, b) => a + b, 0); const maxNormal = kadeneMax(nums); const inverted = nums.map((x) => -x); const minSub = kadeneMax(inverted); const maxWrap = total + minSub; if (nums.every((x) => x < 0)) return maxNormal; return Math.max(maxNormal, maxWrap); },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), -5, 8)]) },

  { key: "min-deletions-palindrome", title: "Minimum Deletions to Make Palindrome", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "minDeletionsForPalindrome", params: ["string"], ret: "int",
    desc: "Given a string s, return the minimum number of characters to delete to make it a palindrome.",
    notes: [],
    fn: (s) => { const n = s.length; const dp = Array.from({ length: n }, () => Array(n).fill(0)); for (let i = n - 1; i >= 0; i--) { for (let j = i + 1; j < n; j++) { dp[i][j] = s[i] === s[j] ? dp[i + 1][j - 1] : 1 + Math.min(dp[i + 1][j], dp[i][j - 1]); } } return n ? dp[0][n - 1] : 0; },
    tests: (r) => ["abca", "abcde", rword(r)] },

  { key: "max-points-on-line-simple", title: "Count Pairs With Equal Sum of Squares", difficulty: "Hard", category: "Hash Table",
    functionName: "countEqualSquareSumPairs", params: ["int[]"], ret: "int",
    desc: "Given an array nums, return the number of pairs (i<j) such that nums[i]^2 + i equals nums[j]^2 + j is NOT required — instead return count of pairs whose squares sum to the same value as any other pair (i.e., count pairs (i,j) with nums[i]*nums[i] == nums[j]*nums[j] and i<j).",
    notes: ["Equivalent to counting pairs of equal absolute value."],
    fn: (nums) => { let count = 0; for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) if (nums[i] * nums[i] === nums[j] * nums[j]) count++; return count; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 8), -5, 5)]) },

  { key: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", difficulty: "Hard", category: "Dynamic Programming",
    functionName: "minCostClimbingStairs", params: ["int[]"], ret: "int",
    desc: "Given an array cost where cost[i] is the cost of step i, return the minimum cost to reach the top (you can start at index 0 or 1, and climb 1 or 2 steps at a time, top is one past the last index).",
    notes: [],
    fn: (cost) => { const n = cost.length; let prev2 = 0, prev1 = 0; for (let i = 2; i <= n; i++) { const cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]); prev2 = prev1; prev1 = cur; } return prev1; },
    tests: (r) => Array.from({ length: 3 }, () => [rarr(r, ri(r, 5, 9), 1, 15)]) },
];

if (ARCH.length !== 100) {
  console.warn(`WARNING: expected 100 archetypes, found ${ARCH.length}`);
}

// ---- starter code generation ----
const javaType = (t) => ({ "int": "int", "int[]": "int[]", "boolean": "boolean", "string": "String", "string[]": "String[]" }[t]);
const javaDefault = (t) => ({ "int": "return 0;", "int[]": "return new int[0];", "boolean": "return false;", "string": "return \"\";", "string[]": "return new String[0];" }[t]);
const argName = (i) => ["a", "b", "c", "d"][i] || `p${i}`;

function starterJS(a) {
  const args = a.params.map((_, i) => argName(i)).join(", ");
  return `function ${a.functionName}(${args}) {\n  // Write your solution here\n}`;
}
function starterPy(a) {
  const args = a.params.map((_, i) => argName(i)).join(", ");
  return `def ${a.functionName}(${args}):\n    # Write your solution here\n    pass`;
}
function starterJava(a) {
  const args = a.params.map((t, i) => `${javaType(t)} ${argName(i)}`).join(", ");
  return `class Solution {\n    public ${javaType(a.ret)} ${a.functionName}(${args}) {\n        // Write your solution here\n        ${javaDefault(a.ret)}\n    }\n}`;
}

// ---- build problems (exactly one instance per archetype — no duplicates) ----
const problems = {};

ARCH.forEach((a, idx) => {
  const seed = idx + 1;
  const r = rng(seed);
  const tests = a.tests(r);
  const expectedLines = tests.map((args) => canon(a.fn(...args)));
  const expectedOutput = expectedLines.join("\n");

  const id = a.key;
  const title = a.title;

  const cr = rng(seed * 7 + 13);
  const numCompanies = ri(cr, 2, 4);
  const shuffled = [...ALL_COMPANIES].sort(() => cr() - 0.5);
  const companies = shuffled.slice(0, numCompanies);
  const frequency = FREQS[ri(cr, 0, FREQS.length - 1)];

  const example = { input: a.params.map((_, i) => `${argName(i)} = ${canon(tests[0][i])}`).join(", "), output: canon(a.fn(...tests[0])) };

  problems[id] = {
    id, title, difficulty: a.difficulty, category: a.category,
    topic: a.category.split(" ")[0],
    companies, frequency,
    description: { text: a.desc, notes: a.notes },
    examples: [example],
    constraints: [],
    functionName: a.functionName,
    params: a.params,
    ret: a.ret,
    tests,
    expectedOutput,
    starterCode: { javascript: starterJS(a), python: starterPy(a), java: starterJava(a) },
  };
});

// ---- write file ----
const header = `// AUTO-GENERATED by scripts/generateProblems.mjs — do not edit by hand.\n// ${ARCH.length} UNIQUE problems across Easy/Medium/Hard with runnable test cases + expected outputs.\n\n`;
const body = `export const PROBLEMS = ${JSON.stringify(problems, null, 2)};\n\n` +
  `export const PROBLEMS_BY_DIFFICULTY = {\n` +
  `  Easy: Object.values(PROBLEMS).filter((p) => p.difficulty === "Easy"),\n` +
  `  Medium: Object.values(PROBLEMS).filter((p) => p.difficulty === "Medium"),\n` +
  `  Hard: Object.values(PROBLEMS).filter((p) => p.difficulty === "Hard"),\n` +
  `};\n\n` +
  `export const LANGUAGE_CONFIG = {\n` +
  `  javascript: { name: "JavaScript", icon: "/javascript.png", monacoLang: "javascript" },\n` +
  `  python: { name: "Python", icon: "/python.png", monacoLang: "python" },\n` +
  `  java: { name: "Java", icon: "/java.png", monacoLang: "java" },\n` +
  `};\n`;

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, header + body);
console.log(`Generated ${ARCH.length} unique problems -> ${OUT}`);
