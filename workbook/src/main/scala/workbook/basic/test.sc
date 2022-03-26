val nums = (1 to 10).toList
val x = nums.filter(_ > 3)
  .filter(_ < 7)
  .map(_ * 10)
val y = nums.withFilter(n => 3 < n && n < 7).map(_ * 10)
