---
layout: dp
title: "Singleton"
section: dp
prev: creational/prototype
next: structural
---

## {{page.title}}

#### Назначение

Убедиться, что у класса есть только один экземпляр, и обеспечить глобальную точку доступа к нему.

#### Диаграмма

![Singleton](https://upload.wikimedia.org/wikipedia/commons/d/d7/Singleton_classdia.png)

#### Пример

Scala позволяет создавать одноэлементные объекты, используя ключевое слово `object`. 
По сути, одноэлементный объект создается автоматически при первом использовании, 
и всегда существует только один экземпляр.

```scala mdoc
object Singleton
val s = Singleton
```

В следующей одноэлементной реализации используется сопутствующий объект. 
Эта реализация актуальна только в том случае, если нам нужно иметь возможность усовершенствовать синглтон. 
В противном случае предпочтительнее краткое решение с использованием одноэлементного объекта (`object`).

```scala mdoc:reset
class Singleton private () // private constructor

object Singleton:
  private val instance: Singleton = new Singleton
  def getInstance() = instance

val s = Singleton.getInstance()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%9E%D0%B4%D0%B8%D0%BD%D0%BE%D1%87%D0%BA%D0%B0_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
