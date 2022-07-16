---
layout: dp
title: "Command"
section: dp
prev: behavioral/chain-of-responsibility
next: behavioral/iterator
---

## {{page.title}}

#### Назначение

Инкапсулировать запрос как объект, тем самым позволяя параметризовать клиентов с различными запросами, 
ставить в очередь или регистрировать запросы и поддерживать операции, которые можно отменить.

#### Диаграмма

![Command](https://upload.wikimedia.org/wikipedia/ru/0/0c/Command.gif)

#### Пример

Класс `Button` ожидает функцию обратного вызова, которую он будет выполнять при вызове метода `click`.

```scala mdoc
class Button(val click: () => Unit)
val button = new Button(() => println("click!"))
button.click()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
