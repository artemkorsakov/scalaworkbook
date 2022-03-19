ThisBuild / version := "0.1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .settings(
    name := "scala_workbook",
    scalaVersion := Dependencies.Version.Scala3,
    scalacOptions ++= List("-feature", "-deprecation", "-Ykind-projector:underscores", "-source:future"),
    libraryDependencies ++= Dependencies.workbook
  )
