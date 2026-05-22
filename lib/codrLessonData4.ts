import type { Lesson } from '../types';

const CODR_LESSONS_4: Lesson[] = [

  // ─── Pattern Recognition Quiz (Unit 2 quiz) ──────────────────────────────────

  {
    id: 'codrP-quiz', name: 'Pattern Recognition Quiz', unit: 2, market: 'shared', xpReward: 50,
    questions: [
      {
        id: 'codrP-quiz-q1', type: 'multiple_choice',
        question: 'Given a sorted array, find if a pair of numbers sums to a target. Which pattern fits?',
        options: ['Binary Search — search for target/2', 'Two Pointers — left and right converge toward the sum', 'Sliding Window — track a running sum', 'HashMap — store all values then look up target-x'],
        correct: 1,
        explanationShort: 'Sorted array + pair sum = Two Pointers. Move left right when sum is too small, move right left when too big. O(n) vs O(n log n) for binary search.',
        tags: ['two_pointers', 'pattern_recognition'],
      },
      {
        id: 'codrP-quiz-q2', type: 'multiple_choice',
        question: 'Find the longest substring of a string with at most k distinct characters. Which pattern fits?',
        options: ['Two Pointers — two indices scanning inward', 'Binary Search — search for the optimal length', 'Sliding Window — expand and shrink the window', 'DFS — explore all possible substrings'],
        correct: 2,
        explanationShort: 'Variable-size Sliding Window: expand right, shrink left when distinct characters exceed k. Classic variable-window problem (LeetCode 340).',
        tags: ['sliding_window', 'pattern_recognition'],
      },
      {
        id: 'codrP-quiz-q3', type: 'multiple_choice',
        question: 'A sorted array has been rotated. Find the index of a target value. Which pattern?',
        options: ['Linear scan — O(n) since it\'s rotated', 'Binary Search — find the rotation point then search', 'Two Pointers — one from each end', 'HashMap — index all values first'],
        correct: 1,
        explanationShort: 'Binary Search still works on a rotated sorted array. One half is always sorted — check which half the target falls in and recurse. LeetCode 33.',
        tags: ['binary_search', 'pattern_recognition'],
      },
      {
        id: 'codrP-quiz-q4', type: 'multiple_choice',
        question: 'Check if a binary tree is symmetric (mirror of itself). Which pattern fits?',
        options: ['BFS level-order — compare each level', 'DFS — recursively compare left.left with right.right and left.right with right.left', 'Two Pointers on the in-order traversal', 'Binary Search on the node values'],
        correct: 1,
        explanationShort: 'DFS recursion: a tree is symmetric if left subtree mirrors right. Compare outer nodes (left.left vs right.right) and inner nodes (left.right vs right.left). LeetCode 101.',
        tags: ['dfs', 'trees', 'pattern_recognition'],
      },
      {
        id: 'codrP-quiz-q5', type: 'multiple_choice',
        question: 'Given an array, find two numbers that sum to a target. The array is unsorted. Which pattern is most efficient?',
        options: ['Sort then Two Pointers — O(n log n)', 'HashMap — store each value, look up target-x in O(1)', 'Sliding Window — track running sums', 'Nested loops — O(n²) brute force'],
        correct: 1,
        explanationShort: 'Unsorted array = HashMap. As you scan, check if target-x is already in the map. O(n) time, O(n) space. LeetCode 1 — the most famous interview question.',
        tags: ['hashmap', 'pattern_recognition'],
      },
      {
        id: 'codrP-quiz-q6', type: 'multiple_choice',
        question: 'Validate a string of brackets: (, ), {, }, [, ]. Every open bracket must close in the correct order. Which pattern?',
        options: ['Two Pointers — one from each end', 'HashMap — map open brackets to close brackets', 'Stack — push opens, pop and match when you see a close', 'BFS — explore all valid sequences'],
        correct: 2,
        explanationShort: 'Stack is perfect for matching nested structure. Push open brackets; when you see a close bracket, pop and verify it matches. LeetCode 20.',
        tags: ['stack', 'pattern_recognition'],
      },
    ],
  },

  // ─── UNIT 3: Complexity & Edge Cases ─────────────────────────────────────────

  {
    id: 'codr3c-lesson1', name: 'Big O: Time Complexity', unit: 3, market: 'shared', xpReward: 25,
    questions: [
      {
        id: 'codr3c-lesson1-q1', type: 'multiple_choice',
        question: 'What does Big O notation describe?',
        options: [
          'The exact number of operations an algorithm performs',
          'How runtime or space grows relative to input size, ignoring constants',
          'The best-case performance of an algorithm',
          'The memory usage of a program in bytes',
        ],
        correct: 1,
        explanationShort: 'Big O describes the growth rate. O(n) means "roughly proportional to n" — double the input, roughly double the time. Constants and small terms are dropped.',
        tags: ['big_o', 'complexity', 'fundamentals'],
      },
      {
        id: 'codr3c-lesson1-q2', type: 'multiple_choice',
        question: 'You scan an array of n elements once. What is the time complexity?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correct: 2,
        explanationShort: 'A single pass over n elements = O(n). Each element is visited exactly once, so time grows linearly with input size.',
        tags: ['big_o', 'linear', 'arrays'],
      },
      {
        id: 'codr3c-lesson1-q3', type: 'multiple_choice',
        question: 'A nested for loop: outer runs n times, inner runs n times. Time complexity?',
        options: ['O(n)', 'O(2n)', 'O(n log n)', 'O(n²)'],
        correct: 3,
        explanationShort: 'n × n = n². Classic brute-force pattern. If the inner loop runs fewer iterations on average (like binary search), it can be O(n log n).',
        tags: ['big_o', 'quadratic', 'nested_loops'],
      },
      {
        id: 'codr3c-lesson1-q4', type: 'multiple_choice',
        question: 'Binary search halves the search space each step. Time complexity?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correct: 2,
        explanationShort: 'Each step halves the remaining work. Starting from n, you can halve at most log₂(n) times before the search space reaches 1. That\'s O(log n).',
        tags: ['big_o', 'logarithmic', 'binary_search'],
      },
    ],
  },

  {
    id: 'codr3c-lesson2', name: 'Space Complexity', unit: 3, market: 'shared', xpReward: 25,
    questions: [
      {
        id: 'codr3c-lesson2-q1', type: 'multiple_choice',
        question: 'You create a HashMap storing each element of an n-element array. Space complexity?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correct: 2,
        explanationShort: 'The map grows with the input — one entry per element. O(n) space. This is the trade-off when you use a HashMap to get O(1) lookups: you pay in memory.',
        tags: ['space_complexity', 'hashmap'],
      },
      {
        id: 'codr3c-lesson2-q2', type: 'multiple_choice',
        question: 'A recursive DFS function calls itself once per node in a tree of depth h. What is the call stack space?',
        options: ['O(1)', 'O(h)', 'O(n)', 'O(n²)'],
        correct: 1,
        explanationShort: 'Each recursive call adds a frame to the call stack. At most h frames exist at once (the depth of the current path). For a balanced tree, h = O(log n). For a skewed tree, h = O(n).',
        tags: ['space_complexity', 'recursion', 'call_stack'],
      },
      {
        id: 'codr3c-lesson2-q3', type: 'multiple_choice',
        question: 'Two Pointers on an array: you use two integer variables (left and right), no extra data structures. Space complexity?',
        options: ['O(n) — you\'re accessing the whole array', 'O(1) — constant extra space regardless of n', 'O(log n) — pointer arithmetic', 'O(2) — two pointers'],
        correct: 1,
        explanationShort: 'O(1) means constant extra space — independent of input size. Two integers don\'t grow with n. This is why Two Pointers is praised: O(n) time, O(1) space.',
        tags: ['space_complexity', 'two_pointers', 'in_place'],
      },
      {
        id: 'codr3c-lesson2-q4', type: 'multiple_choice',
        question: 'BFS uses a queue. At its largest, the queue holds all nodes at the widest level of the tree. What is the space complexity?',
        options: ['O(log n)', 'O(h) — tree height', 'O(n) — in the worst case (complete tree, widest level = n/2)', 'O(1)'],
        correct: 2,
        explanationShort: 'BFS queue space = width of the widest level. For a complete binary tree, the bottom level has n/2 nodes. So worst-case O(n). This is why BFS uses more space than DFS.',
        tags: ['space_complexity', 'bfs', 'queue'],
      },
    ],
  },

  {
    id: 'codr3c-lesson3', name: 'Edge Cases: What Breaks Algorithms', unit: 3, market: 'shared', xpReward: 25,
    questions: [
      {
        id: 'codr3c-lesson3-q1', type: 'multiple_choice',
        question: 'Your Two Sum solution works for [2, 7, 11, 15] with target 9. What edge case should you test next?',
        options: [
          'A very large array',
          'An empty array or array with one element',
          'An array with all positive numbers',
          'A target that equals the first element',
        ],
        correct: 1,
        explanationShort: 'Empty and single-element inputs break algorithms that assume pairs exist. Always test: empty, single-element, two elements, all-same, negative numbers. These are the cases that crash solutions.',
        tags: ['edge_cases', 'two_sum', 'testing'],
      },
      {
        id: 'codr3c-lesson3-q2', type: 'multiple_choice',
        question: 'Your binary search works on [1, 3, 5, 7]. What edge case is most likely to break it?',
        options: [
          'Target is the middle element',
          'Target is smaller than all elements (left boundary) or larger than all elements (right boundary)',
          'Array has an even number of elements',
          'Target appears twice in the array',
        ],
        correct: 1,
        explanationShort: 'Boundary cases break binary search. If the target is less than nums[0] or greater than nums[-1], many implementations return the wrong index or go out of bounds.',
        tags: ['edge_cases', 'binary_search', 'boundaries'],
      },
      {
        id: 'codr3c-lesson3-q3', type: 'multiple_choice',
        question: 'You\'re writing a function that removes duplicates from a list. Which edge case is most important to handle?',
        options: [
          'A list with 1000 elements',
          'A list where all elements are duplicates (e.g. [3, 3, 3, 3])',
          'A list with both positive and negative numbers',
          'A list that is already sorted',
        ],
        correct: 1,
        explanationShort: 'All-same input is a degenerate case — the output should be [3]. Many solutions fail here by off-by-one errors in the deduplication logic.',
        tags: ['edge_cases', 'duplicates', 'arrays'],
      },
      {
        id: 'codr3c-lesson3-q4', type: 'multiple_choice',
        question: 'In an interview, you\'ve coded your solution. The interviewer says "looks good." What should you do next?',
        options: [
          'Thank them and wait for the next question',
          'Walk through edge cases out loud: empty input, single element, all same, negative values, large input',
          'Start optimising the time complexity immediately',
          'Ask if the solution is correct',
        ],
        correct: 1,
        explanationShort: 'Proactively testing edge cases is one of the clearest signals of engineering maturity. Interviewers at Bloomberg, Goldman, and Revolut specifically look for this step.',
        tags: ['edge_cases', 'interviews', 'process'],
      },
    ],
  },

  {
    id: 'codr3c-quiz', name: 'Complexity Quiz', unit: 3, market: 'shared', xpReward: 50,
    questions: [
      {
        id: 'codr3c-quiz-q1', type: 'multiple_choice',
        question: 'What is the time complexity of this code?\n\nfor i in range(n):\n    for j in range(i, n):\n        print(i, j)',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2n)'],
        correct: 2,
        explanationShort: 'The outer loop runs n times, the inner runs n-i times each. Total = n + (n-1) + ... + 1 = n(n+1)/2 ≈ n². Drop constants and lower-order terms: O(n²).',
        tags: ['big_o', 'time_complexity'],
      },
      {
        id: 'codr3c-quiz-q2', type: 'multiple_choice',
        question: 'A recursive function calls itself twice per call (like a naive Fibonacci). Time complexity?',
        options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'],
        correct: 2,
        explanationShort: 'Each call spawns 2 more calls. The call tree has depth n, so the number of calls is roughly 2^n. This is why memoisation (DP) matters — it cuts this to O(n).',
        tags: ['big_o', 'recursion', 'exponential'],
      },
      {
        id: 'codr3c-quiz-q3', type: 'multiple_choice',
        question: 'You store BFS results in a list as you traverse all n nodes. Time and space complexity?',
        options: ['O(n) time, O(1) space', 'O(n log n) time, O(n) space', 'O(n) time, O(n) space', 'O(log n) time, O(n) space'],
        correct: 2,
        explanationShort: 'BFS visits each node once: O(n) time. Storing results for all n nodes: O(n) space. This is the standard BFS complexity.',
        tags: ['bfs', 'time_complexity', 'space_complexity'],
      },
      {
        id: 'codr3c-quiz-q4', type: 'multiple_choice',
        question: 'Which edge case would most likely cause an IndexError in a sliding window implementation?',
        options: [
          'An array with 1000 elements',
          'An array with negative values',
          'An empty array or an array shorter than the window size',
          'An array that is already sorted',
        ],
        correct: 2,
        explanationShort: 'If the array is shorter than k (window size), accessing index k-1 goes out of bounds. Always guard: if len(nums) < k: return [].',
        tags: ['edge_cases', 'sliding_window', 'bugs'],
      },
      {
        id: 'codr3c-quiz-q5', type: 'multiple_choice',
        question: 'Mergesort splits the array in half recursively, then merges. Time complexity?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correct: 1,
        explanationShort: 'log n levels of splitting × O(n) work per merge = O(n log n). This is the lower bound for comparison-based sorting — you can\'t do better for the general case.',
        tags: ['big_o', 'sorting', 'divide_and_conquer'],
      },
    ],
  },

  // ─── UNIT 5: Coding Interview Skills ─────────────────────────────────────────

  {
    id: 'codrIS-lesson1', name: 'The 5-Step Interview Framework', unit: 5, market: 'shared', xpReward: 25,
    questions: [
      {
        id: 'codrIS-lesson1-q1', type: 'multiple_choice',
        question: 'An interviewer gives you a problem. What is the correct first step?',
        options: [
          'Start coding immediately to show speed',
          'Clarify constraints and edge cases before touching the keyboard',
          'State the brute-force solution first, then optimise',
          'Ask the interviewer which algorithm to use',
        ],
        correct: 1,
        explanationShort: 'Clarifying constraints is step 1. "Can the input be empty? Can values be negative? What are the size limits?" Coding before clarifying is the single biggest interview mistake.',
        tags: ['interview_framework', 'clarify'],
      },
      {
        id: 'codrIS-lesson1-q2', type: 'multiple_choice',
        question: 'After clarifying, what should you do before writing any code?',
        options: [
          'Write the full solution in one go',
          'State your approach out loud and confirm the interviewer agrees before coding',
          'Ask the interviewer to confirm your approach is optimal',
          'Write test cases first',
        ],
        correct: 1,
        explanationShort: 'Say your approach first: "I\'m thinking Two Pointers because the array is sorted..." Getting agreement before coding prevents spending 15 minutes on the wrong approach.',
        tags: ['interview_framework', 'approach'],
      },
      {
        id: 'codrIS-lesson1-q3', type: 'multiple_choice',
        question: 'You\'ve finished coding. What is the correct next step?',
        options: [
          'Submit and wait for feedback',
          'Explain what your code does line by line',
          'Trace through a concrete example manually, checking your logic',
          'Ask the interviewer if they can see any bugs',
        ],
        correct: 2,
        explanationShort: 'Trace through an example yourself. Pick a simple input and run your code mentally (or on the whiteboard). Catch bugs yourself before the interviewer does — it shows rigour.',
        tags: ['interview_framework', 'testing'],
      },
      {
        id: 'codrIS-lesson1-q4', type: 'multiple_choice',
        question: 'After testing your solution, what is the final step?',
        options: [
          'Ask if you got the job',
          'Analyse time and space complexity, and discuss if a more optimal solution exists',
          'Rewrite the solution more cleanly',
          'Ask the interviewer to run the code',
        ],
        correct: 1,
        explanationShort: 'State complexity: "This is O(n) time, O(n) space. We could reduce space to O(1) with Two Pointers." Proactively discussing trade-offs is what separates strong candidates.',
        tags: ['interview_framework', 'complexity', 'optimise'],
      },
    ],
  },

  {
    id: 'codrIS-lesson2', name: 'Communicating While You Code', unit: 5, market: 'shared', xpReward: 25,
    questions: [
      {
        id: 'codrIS-lesson2-q1', type: 'multiple_choice',
        question: 'You\'re stuck and can\'t think of the optimal solution. What should you do?',
        options: [
          'Stay silent and keep thinking until you have the answer',
          'Say you don\'t know and move on',
          'State the brute-force approach, explain why it\'s suboptimal, then reason toward a better solution out loud',
          'Ask the interviewer for the answer',
        ],
        correct: 2,
        explanationShort: 'Never go silent. Say "The brute-force is O(n²) with nested loops. I\'m thinking about what we\'re repeatedly computing and whether a HashMap could help..." Interviewers can\'t help you if they don\'t know where you\'re stuck.',
        tags: ['communication', 'stuck', 'interviews'],
      },
      {
        id: 'codrIS-lesson2-q2', type: 'multiple_choice',
        question: 'While coding, you realise your initial approach won\'t work. What do you say?',
        options: [
          'Nothing — quietly start over',
          '"Actually, I think this approach has a problem because [reason]. Let me try [alternative]."',
          '"I made a mistake, sorry."',
          'Keep going with the broken approach and hope the interviewer doesn\'t notice',
        ],
        correct: 1,
        explanationShort: 'Pivoting openly is a strength, not a weakness. "I see this won\'t handle the edge case where the array is empty — let me add a guard here" shows you can debug your own thinking.',
        tags: ['communication', 'pivoting', 'interviews'],
      },
      {
        id: 'codrIS-lesson2-q3', type: 'multiple_choice',
        question: 'An interviewer at Bloomberg gives you a hint. How should you respond?',
        options: [
          'Ignore it — you want to solve it independently',
          'Acknowledge the hint, incorporate it, and explain how it changes your approach',
          'Ask for more hints until the solution is obvious',
          'Say "thanks" and keep doing what you were doing',
        ],
        correct: 1,
        explanationShort: 'Hints are collaborative, not cheating. Acknowledge: "That\'s a good point — if I track the running minimum, I can check for profit in O(1) instead of scanning back." Shows you listen and adapt.',
        tags: ['communication', 'hints', 'collaboration'],
      },
      {
        id: 'codrIS-lesson2-q4', type: 'multiple_choice',
        question: 'What does "thinking out loud" mean in a coding interview?',
        options: [
          'Reading your code back to the interviewer as you type',
          'Narrating your reasoning — why you\'re choosing a data structure, what trade-off you\'re making, what you\'re about to check',
          'Talking through every line of syntax',
          'Asking the interviewer questions constantly',
        ],
        correct: 1,
        explanationShort: '"I\'m using a set here because I need O(1) membership checks" or "I\'ll handle the edge case at the top before the main logic." Narrate reasoning, not syntax. The interviewer cares how you think.',
        tags: ['communication', 'thinking_aloud', 'interviews'],
      },
    ],
  },

  {
    id: 'codrIS-lesson3', name: 'Pattern Recognition: Advanced', unit: 5, market: 'shared', xpReward: 30,
    questions: [
      {
        id: 'codrIS-lesson3-q1', type: 'multiple_choice',
        question: 'You see a problem asking for the k largest elements in an unsorted array. Which pattern fits?',
        options: [
          'Sort the array and take the last k — O(n log n)',
          'Heap/Priority Queue — maintain a min-heap of size k — O(n log k)',
          'Two Pointers — O(n)',
          'Binary Search on the answer — O(n log n)',
        ],
        correct: 1,
        explanationShort: 'Heap is the canonical solution for "top k" problems. A min-heap of size k processes each element once: if the new element is larger than the heap\'s minimum, swap. O(n log k). LeetCode 215.',
        tags: ['heap', 'pattern_recognition', 'top_k'],
      },
      {
        id: 'codrIS-lesson3-q2', type: 'multiple_choice',
        question: 'Find all paths from root to leaf in a binary tree where the path sum equals a target. Which pattern?',
        options: [
          'BFS level-order — check sums at each level',
          'DFS with backtracking — build path recursively, backtrack when sum exceeds target',
          'Two Pointers on the sorted in-order traversal',
          'Binary Search on the tree',
        ],
        correct: 1,
        explanationShort: 'DFS + backtracking: recurse with remaining_sum = target - node.val. If at a leaf and remaining_sum == 0, it\'s a valid path. Backtrack by removing the node from the path. LeetCode 113.',
        tags: ['dfs', 'backtracking', 'trees', 'pattern_recognition'],
      },
      {
        id: 'codrIS-lesson3-q3', type: 'multiple_choice',
        question: 'You need to detect if a linked list has a cycle. Which pattern uses O(1) space?',
        options: [
          'HashSet — store all visited nodes',
          'Fast and Slow Pointers (Floyd\'s algorithm) — two pointers at different speeds',
          'Stack — push nodes, detect repeat',
          'Reverse the list and check if it equals the original',
        ],
        correct: 1,
        explanationShort: 'Floyd\'s: slow moves 1 step, fast moves 2. If there\'s a cycle, fast laps slow and they meet. O(n) time, O(1) space. The HashSet approach is O(n) space. LeetCode 141.',
        tags: ['two_pointers', 'linked_list', 'cycle', 'pattern_recognition'],
      },
      {
        id: 'codrIS-lesson3-q4', type: 'multiple_choice',
        question: '"Given n, return all valid combinations of n pairs of parentheses." What approach fits?',
        options: [
          'Sliding Window — track open and close counts',
          'Dynamic Programming — build from smaller solutions',
          'Backtracking — add open/close brackets recursively, prune invalid states',
          'Two Pointers — one for open, one for close',
        ],
        correct: 2,
        explanationShort: 'Backtracking: at each step, add "(" if open < n, add ")" if close < open. Prune when close > open (invalid). This generates only valid combinations without brute force. LeetCode 22.',
        tags: ['backtracking', 'recursion', 'pattern_recognition'],
      },
    ],
  },

  {
    id: 'codrIS-quiz', name: 'Final Exam', unit: 5, market: 'shared', xpReward: 75,
    questions: [
      {
        id: 'codrIS-quiz-q1', type: 'multiple_choice',
        question: 'An interviewer says: "Find the maximum profit from buying and selling a stock once." You\'re given an array of prices. What\'s the first thing you do?',
        options: [
          'Start coding the O(n²) brute force',
          'Clarify: can I buy and sell on the same day? Can prices be negative? What if the price only falls?',
          'Tell the interviewer the answer is O(n) using a running minimum',
          'Draw a graph of the prices',
        ],
        correct: 1,
        explanationShort: 'Always clarify first. Edge cases here: all-decreasing prices (answer is 0 or -1?), same-day buy/sell, array of length 1. Getting these wrong changes the solution.',
        tags: ['interview_framework', 'clarify'],
      },
      {
        id: 'codrIS-quiz-q2', type: 'multiple_choice',
        question: 'What is the time and space complexity of BFS on a graph with V vertices and E edges?',
        options: ['O(V) time, O(1) space', 'O(V + E) time, O(V) space', 'O(V²) time, O(V) space', 'O(E) time, O(E) space'],
        correct: 1,
        explanationShort: 'BFS visits each vertex once (O(V)) and each edge once (O(E)) — total O(V + E). The queue holds at most all vertices: O(V) space.',
        tags: ['bfs', 'graphs', 'complexity'],
      },
      {
        id: 'codrIS-quiz-q3', type: 'multiple_choice',
        question: 'You\'ve written a solution. The interviewer asks "can you make it more space-efficient?" Your current solution uses a HashMap. What should you consider?',
        options: [
          'Replace the HashMap with a list — same space, different lookup',
          'Ask if the input can be sorted — a sorted input often enables O(1) space solutions (Two Pointers)',
          'Use a smaller HashMap',
          'Tell them space can\'t be reduced below O(n)',
        ],
        correct: 1,
        explanationShort: 'HashMap → Two Pointers is a classic space trade-off. Sort first (O(n log n) time) then Two Pointers uses O(1) space. Being able to articulate this trade-off is what strong candidates do.',
        tags: ['optimisation', 'trade_offs', 'interviews'],
      },
      {
        id: 'codrIS-quiz-q4', type: 'multiple_choice',
        question: 'You\'re asked to design a data structure that supports: insert, delete, and getRandom — all in O(1). What do you use?',
        options: [
          'A HashMap alone — get is O(1) but delete is O(n)',
          'A HashMap + ArrayList — map value to index, swap deleted element with last, pop from list',
          'A linked list with a HashMap for fast lookup',
          'A sorted array — binary search for O(log n) operations',
        ],
        correct: 1,
        explanationShort: 'HashMap maps value → index in the ArrayList. To delete: swap with the last element (updating its index in the map), then pop. getRandom picks a random ArrayList index. LeetCode 380.',
        tags: ['data_structures', 'design', 'hashmap'],
      },
      {
        id: 'codrIS-quiz-q5', type: 'multiple_choice',
        question: 'Which of these is the strongest way to end a coding interview?',
        options: [
          '"I think my solution is correct." (silence)',
          '"Here\'s the time complexity, here\'s the space complexity, and if I had more time I\'d optimise [specific thing] because [reason]."',
          '"Can you tell me if I passed?"',
          '"I could also solve this with dynamic programming if needed."',
        ],
        correct: 1,
        explanationShort: 'A strong close: state complexity, then show awareness of the trade-offs and what the next optimisation would be. It demonstrates you can reason beyond "it works" — which is exactly what Bloomberg and Revolut look for.',
        tags: ['interviews', 'communication', 'complexity'],
      },
    ],
  },
];

export default CODR_LESSONS_4;
