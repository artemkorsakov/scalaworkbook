package workbook

import munit.ScalaCheckSuite
import org.scalacheck.Prop.*
import workbook.MyProgram.sum

class MyProgramSuite extends ScalaCheckSuite:

  property("sum is commutative") {
    forAll { (n1: Int, n2: Int) =>
      sum(n1, n2) == n2 + n1
    }
  }
