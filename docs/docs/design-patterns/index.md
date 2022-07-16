---
layout: dp
title: "Design Patterns"
section: dp
next: creational
---

## {{page.title}}

Шаблон проектирования обычно рассматривается как многоразовое решение часто встречающейся 
проблемы проектирования в объектно-ориентированном программном обеспечении.

#### Проектное пространство

Пространство шаблонов проектирования, представленное в таблице ниже, имеет два измерения: 
цель (_purpose_) и область применения (_scope_). 
Шаблоны целей могут быть классифицированы как _creational_, _structural_ или _behavioral_.
[Порождающие шаблоны](@PATTERNS@creational) (_creational_) имеют дело с созданием объектов, 
в то время как [структурные шаблоны](@PATTERNS@structural) (_structural_) имеют дело с составом классов или объектов. 
[Поведенческие шаблоны](@PATTERNS@behavioral) (_behavioral_) описывают взаимодействие объектов 
и часто распределение ответственности между объектами. 

Измерение области видимости определяет, ["применяется ли шаблон в первую очередь к классам или к объектам"][Design Patterns]. 

Шаблоны классов имеют дело с отношениями между классами и их подклассами. 
Поскольку эти отношения определяются во время компиляции посредством наследования, 
они фиксированы и не могут изменяться во время выполнения. 
В шаблонах классов шаблон в целом содержится в одной иерархии классов.

Объектные шаблоны, с другой стороны, имеют дело с отношениями между объектами, такими как композиция и делегирование. 
Это означает, что связь может изменяться во время выполнения.
В шаблонах объектов комбинированное поведение шаблона распределяется между несколькими объектами во время выполнения.

| **Scope** \ **Purpose** | **Creational**                                                                                                                                                                                                 | **Structural**                                                                                                                                                                                                                                                                                                                                | **Behavioral**                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Class**               | [Factory Method](@PATTERNS@creational/factory-method)                                                                                                                                                          | [Adapter(class)](@PATTERNS@structural/adapter)                                                                                                                                                                                                                                                                                                | [Interpreter](@PATTERNS@behavioral/interpreter) <br /> [Template Method](@PATTERNS@behavioral/template-method)                                                                                                                                                                                                                                                                                                                                                      |
| **Object**              | [Abstract Factory](@PATTERNS@creational/abstract-factory) <br /> [Builder](@PATTERNS@creational/builder) <br /> [Prototype](@PATTERNS@creational/prototype) <br /> [Singleton](@PATTERNS@creational/singleton) | [Adapter(object)](@PATTERNS@structural/adapter) <br /> [Bridge](@PATTERNS@structural/bridge) <br /> [Composite](@PATTERNS@structural/composite) <br /> [Decorator](@PATTERNS@structural/decorator) <br /> [Facade](@PATTERNS@structural/facade) <br /> [Flyweight](@PATTERNS@structural/flyweight) <br /> [Proxy](@PATTERNS@structural/proxy) | [Chain of Responsibility](@PATTERNS@behavioral/chain-of-responsibility) <br /> [Command](@PATTERNS@behavioral/command) <br /> [Iterator](@PATTERNS@behavioral/iterator) <br /> [Mediator](@PATTERNS@behavioral/mediator) <br /> [Memento](@PATTERNS@behavioral/memento) <br /> [Observer](@PATTERNS@behavioral/observer) <br /> [State](@PATTERNS@behavioral/state) <br /> [Strategy](@PATTERNS@behavioral/strategy) <br /> [Visitor](@PATTERNS@behavioral/visitor) |


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Design Patterns by Gamma, Helm, Johnson, and Vlissides][Design Patterns]

[Design Patterns]: https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612
