package workbook

import munit.ScalaCheckSuite
import org.scalacheck.Prop.*
import workbook.MyProgram.sum

class MyProgramSuite extends ScalaCheckSuite:

  property("should calculate the sum of numbers") {
    forAll { (n1: Int, n2: Int) =>
      sum(n1, n2) == n2 + n1
    }
  }

  property("sum is commutative") {
    forAll { (n1: Int, n2: Int) =>
      sum(n1, n2) == sum(n2, n1)
    }
  }
