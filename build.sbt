import Dependencies.Version._

ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := Scala3

ThisBuild / scalacOptions ++= List("-feature", "-deprecation", "-Ykind-projector:underscores", "-source:future")

ThisBuild / githubWorkflowPublishTargetBranches := Seq()

lazy val root = (project in file("."))
  .settings(
    name := "scala_workbook",
    libraryDependencies ++= Dependencies.workbook
  )
