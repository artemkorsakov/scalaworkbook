---
layout: docsplus
title: "Именованные параметры"
prev: methods/default-parameters
next: methods/by-name-parameter
---

## {{page.title}}

При вызове метода при желании можно использовать имена параметров.
Например, `makeConnection` также можно вызывать следующими способами:

```scala mdoc:silent
def makeConnection(timeout: Int = 5_000, protocol: String = "http") =
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
```

```scala mdoc
makeConnection(timeout=10_000)
makeConnection(protocol="https")
makeConnection(timeout=10_000, protocol="https")
makeConnection(protocol="https", timeout=10_000)
```

Именованные параметры особенно полезны, когда несколько параметров метода имеют один и тот же тип.
Без помощи IDE очень сложно понять, какие параметры установлены в значение `true` или `false`,
и поэтому код может быть трудночитаемым:

```scala
engage(true, true, true, false)
```

Гораздо более понятным выглядит использование именованных переменных:

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```


---

**References:**
- [Scala3 book, Method Features](https://docs.scala-lang.org/scala3/book/methods-most.html)
