---
layout: dp
title: "Strategy"
section: dp
prev: behavioral/state
next: behavioral/visitor
---

## {{page.title}}

#### Назначение

Определение семейства алгоритмов, инкапсулирование каждого из них и создание их взаимозаменяемыми. 
Стратегия позволяет алгоритму изменяться независимо от клиентов, которые его используют.

#### Диаграмма

![Strategy](https://upload.wikimedia.org/wikipedia/ru/4/4c/Strategy_pattern.PNG)

#### Пример

`Strategy` определяет интерфейс алгоритма. 
`Context` поддерживает ссылку на текущий объект `Strategy` и перенаправляет запросы от клиентов конкретному алгоритму.

```scala mdoc:silent
object FileMatcher:
  private val filesHere: Seq[String] =
    Seq(
      "example.txt",
      "file.txt.png",
      "1txt"
    )

  // Strategy selection
  def filesContaining(query: String): Seq[String] =
    filesMatching(_.contains(query)) // inline strategy

  def filesRegex(query: String): Seq[String] =
    filesMatching(matchRegex(query)) // using a method

  def filesEnding(query: String): Seq[String] =
    filesMatching(new FilesEnding(query).matchEnding) // lifting a method

  // matcher is a strategy
  private def filesMatching(matcher: String => Boolean): Seq[String] =
    for
      file <- filesHere
      if matcher(file)
    yield file

  // Strategies
  private def matchRegex(query: String): String => Boolean =
    (s: String) => s.matches(query)

  private class FilesEnding(query: String):
    def matchEnding(s: String): Boolean = s.endsWith(query)
```

```scala mdoc
val query = ".txt"
FileMatcher.filesContaining(query)
FileMatcher.filesRegex(query)
FileMatcher.filesEnding(query)
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D1%80%D0%B0%D1%82%D0%B5%D0%B3%D0%B8%D1%8F_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
