---
layout: dp
title: "Interpreter"
section: dp
prev: behavioral
next: behavioral/template-method
---

## {{page.title}}

#### Назначение

Для заданного языка определить представление для его грамматики 
вместе с интерпретатором, который использует представление для интерпретации предложений на языке.

#### Диаграмма

![Interpreter](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Interpreter_UML_class_diagram.svg/804px-Interpreter_UML_class_diagram.svg.png)

#### Пример

```scala mdoc:silent
class Context:
  import scala.collection.mutable
  val result: mutable.Stack[String] = mutable.Stack.empty[String]

trait Expression:
  def interpret(context: Context): Unit

trait OperatorExpression extends Expression:
  val left: Expression
  val right: Expression

  def interpret(context: Context): Unit =
    left.interpret(context)
    val leftValue = context.result.pop()

    right.interpret(context)
    val rightValue = context.result.pop()

    doInterpret(context, leftValue, rightValue)

  protected def doInterpret(context: Context, leftValue: String, rightValue: String): Unit

end OperatorExpression
```

```scala mdoc:silent
trait EqualsExpression extends OperatorExpression:
  protected override def doInterpret(context: Context, leftValue: String, rightValue: String): Unit =
    context.result.push(if leftValue == rightValue then "true" else "false")

trait OrExpression extends OperatorExpression:
  protected override def doInterpret(context: Context, leftValue: String, rightValue: String): Unit =
    context.result.push(if leftValue == "true" || rightValue == "true" then "true" else "false")

trait MyExpression extends Expression:
  var value: String

  def interpret(context: Context): Unit =
    context.result.push(value)
```

```scala mdoc
val context = Context()
val input = new MyExpression() { var value = "" }

var expression = new OrExpression {
  val left: Expression = new EqualsExpression {
    val left = input
    val right = new MyExpression { var value = "4" }
  }
  val right: Expression = new EqualsExpression {
    val left = input
    val right = new MyExpression { var value = "четыре" }
  }
}

{
  input.value = "четыре"
  expression.interpret(context)
  context.result.pop()
}

{
  input.value = "44"
  expression.interpret(context)
  context.result.pop()
}
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BF%D1%80%D0%B5%D1%82%D0%B0%D1%82%D0%BE%D1%80_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
