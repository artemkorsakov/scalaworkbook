package foo {
  def double(i: Int) = i * 2
}

package foo {
  package bar {
    @main def fooBarMain =
      println(s"${double(1)}")
  }
}
