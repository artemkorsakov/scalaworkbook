ThisBuild / version := "0.1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .settings(
    name := "scala_workbook",
    scalaVersion := Dependencies.Version.Scala3,
    libraryDependencies ++= Dependencies.workbook
  )
