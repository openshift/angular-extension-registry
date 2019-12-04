
# How to contribute

Grafana uses GitHub to manage contributions.
Contributions take the form of pull requests that will be reviewed by the core team.

- If you are a new contributor see: [Steps to Contribute](#steps-to-contribute).

- If you have a trivial fix or improvement, go ahead and create a pull request.

- If you plan to do something more involved, discuss your idea on the respective [issue](https://github.com/openshift/angular-extension-registry/issues) or create a [new issue](https://github.com/openshift/angular-extension-registry/issues/new) if it does not exist. This will avoid unnecessary work and surely give you and us a good deal of inspiration.


## Steps to contribute

Should you wish to work on a GitHub issue, check first if it is not already assigned to someone. If it is free, you claim it by commenting on the issue that you want to work on it. This is to prevent duplicated efforts from contributors on the same issue.

### View the demos

Clone the project, then run the following from the root directory:

`npm install`
`bower install`
`gulp serve`

This will load a file in your browser with links to the `/demos` directory.  Feel free to experiment
with these examples.

## Pull request checklist

Whether you are contributing or doing code review, first read and understand https://google.github.io/eng-practices/review/reviewer/ for general engineering practices around code reviews

- Branch from the master branch and, if needed, rebase to the current master branch before submitting your pull request. If it doesn't merge cleanly with master you may be asked to rebase your changes.

- If your patch is not getting reviewed or you need a specific person to review it, you can @-reply a reviewer asking for a review in the pull request or a comment.

- Add tests relevant to the fixed bug or new feature.

### High-level checks

- [ ] The pull request works the way it says it should do.
- [ ] The pull request closes one issue if possible and does not fix unrelated issues within the same pull request.
- [ ] The pull request contains necessary tests.

### Low-level checks

- [ ] The pull request contains a title that explains it. It follows [PR and commit messages guidelines](#Pull-Requests-titles-and-message).
- [ ] The pull request contains necessary links to issues.
- [ ] The pull request contains commits with messages that are small and understandable. It follows [PR and commit messages guidelines](#Pull-Requests-titles-and-message).
- [ ] The pull request does not contain magic strings or numbers that could be replaced with an `Enum` or `const` instead.

#### Bug-specific checks

- [ ] The pull request contains `Closes: #Issue` or `Fixes: #Issue` in pull request description.
- [ ] The Pull Request adds tests that replicate the fixed bug and helps avoid regressions.

### Pull request titles and message

Pull request titles should follow this format: `Area: Name of the change`.
Titles are used to generate the changelog so they should be as descriptive as possible in one line.

Good examples:

- `Explore: Adds Live option for supported datasources`
- `GraphPanel: Don't sort series when legend table & sort column is not visible`
- `Documnents: Created CONTRIBUTION.MD file for project contribution guideline`

The message in the Pull requests should contain a reference so the issue if there is one. Ex `Closes #<issue number>`, `Fixes #<issue number>`, or `Ref #<issue number>` if the change is related to an issue but does not close it. Make sure to explain what problem the pull request is solving and why its implemented this way. As a new contributor its often better to overcommunicate to avoid back and forth communication, as it consumes time and energy.

### GIT commit formating.

The commit message of the commits in the Pull Request can still be part of the git commit body. So it's always encouraged to write informative commit messages.

The Git commit title should be short, descriptive and include the Pull Request ID.

Good examples:

- `Explore: Live supprt in datasources (#12345)`
- `GraphPanel: Fix legend sorting issues (#12345)`
- `Documnents: Created CONTRIBUTION.MD file (#12345)`

Its also good practice to include a reference to the issue in the git commit body when possible.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting



