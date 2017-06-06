# Usage

Consult the [README.md](README.md) for basic usage.

# Development

## Git flow

At the time of writing this document, this repository follows the [git flow](https://github.com/nvie/gitflow) model.  For a good summary of git flow,
checkout the [git-flow-cheatsheet](http://danielkummer.github.io/git-flow-cheatsheet/).

To summarize, here is the branching model:

```
- master
  - hotfix/1.0.1
- develop
  - feature/some-feature
  - feature/some-other-feature
  - release/1.2.0
```

### Starting a feature:
`git flow feature start my-feature-name`

Will create a feature branch.

### Finishing a feature:
`git flow feature finish my-feature-name`

Will finish the feature, merge it into develop and delete the feature branch.

### Release
(This is a big one)

`git flow relase start x.x.x`

Creates a release branch off of develop.  Do this to indicate a set of features
ready to be tested before merging into master.  Follow `semver` for naming.

`fit flow release finish x.x.x`

Merges the `release` branch into `master`, `tags` the release with the `x.x.x` release branch name, back merges the `release` into `develop` (in case of bug fixes), deletes the `release` branch.

Don't forget to publish branches & tags!

`git push origin master`
`git push origin develop`
`git push --tags`

### Hotfixes & the rest of gitflow

Consult the git-flow-cheatsheet or git flow documentation for other features of this workflow.
