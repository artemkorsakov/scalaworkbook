---
layout: dp
title: "Design Patterns"
section: dp
next: abstract-factory
---

## {{page.title}}

Шаблон проектирования обычно рассматривается как многоразовое решение часто встречающейся 
проблемы проектирования в объектно-ориентированном программном обеспечении.

#### Проектное пространство

Пространство шаблонов проектирования, представленное в таблице ниже, имеет два измерения: 
цель (_purpose_) и область применения (_scope_). 
Шаблоны целей могут быть классифицированы как _creational_, _structural_ или _behavioral_.
[Порождающие шаблоны](https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D1%80%D0%BE%D0%B6%D0%B4%D0%B0%D1%8E%D1%89%D0%B8%D0%B5_%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)
(_creational_) имеют дело с созданием объектов, 
в то время как [структурные шаблоны](https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%BD%D1%8B%D0%B5_%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F) 
(_structural_) имеют дело с составом классов или объектов. 
[Поведенческие паттерны](https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5_%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F) 
(_behavioral_) описывают взаимодействие объектов 
и часто распределение ответственности между объектами. 

Измерение области видимости определяет, ["применяется ли шаблон в первую очередь к классам или к объектам"][Design Patterns]. 

Шаблоны классов имеют дело с отношениями между классами и их подклассами. 
Поскольку эти отношения определяются во время компиляции посредством наследования, 
они фиксированы и не могут изменяться во время выполнения. 
В шаблонах классов шаблон в целом содержится в одной иерархии классов.

Объектные шаблоны, с другой стороны, имеют дело с отношениями между объектами, такими как композиция и делегирование. 
Это означает, что связь может изменяться во время выполнения.
В шаблонах объектов комбинированное поведение шаблона распределяется между несколькими объектами во время выполнения.

| **Scope** \ **Purpose** | **Creational**                                                                                                                                                     | **Structural**                                                                                                                                                                                                                                                   | **Behavioral**                                                                                                                                                                                                                                                                                                                                                   |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Class**               | [Factory Method](@PATTERNS@factory-method)                                                                                                                         | [Adapter(class)](@PATTERNS@adapter)                                                                                                                                                                                                                              | [Interpreter](@PATTERNS@interpreter) <br /> [Template Method](@PATTERNS@template-method)                                                                                                                                                                                                                                                                         |
| **Object**              | [Abstract Factory](@PATTERNS@abstract-factory) <br /> [Builder](@PATTERNS@builder) <br /> [Prototype](@PATTERNS@prototype) <br /> [Singleton](@PATTERNS@singleton) | [Adapter(object)](@PATTERNS@adapter) <br /> [Bridge](@PATTERNS@bridge) <br /> [Composite](@PATTERNS@composite) <br /> [Decorator](@PATTERNS@decorator) <br /> [Facade](@PATTERNS@facade) <br /> [Flyweight](@PATTERNS@flyweidht) <br /> [Proxy](@PATTERNS@proxy) | [Chain of Responsibility](@PATTERNS@chain-of-responsibility) <br /> [Command](@PATTERNS@command) <br /> [Iterator](@PATTERNS@iterator) <br /> [Mediator](@PATTERNS@mediator) <br /> [Memento](@PATTERNS@memento) <br /> [Observer](@PATTERNS@observer) <br /> [State](@PATTERNS@state) <br /> [Strategy](@PATTERNS@strategy) <br /> [Visitor](@PATTERNS@visitor) |


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Design Patterns by Gamma, Helm, Johnson, and Vlissides][Design Patterns]

[Design Patterns]: https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612
