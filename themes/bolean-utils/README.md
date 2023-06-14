# NAME

bolean-utils-hugo - Utility theme for [Hugo] projects.


# DESCRIPTION

This theme provides commonly-used functionality such as compiling assets,
finding a page's slug, or retriving the first image in a Package without
affecting the look and feel of a hugo website that uses it.


# USAGE

1. Register the git submodule, locking your project to the latest version.
   Within your project's `themes/` directory:
   `git submodule add git@bitbucket.org:proitekinc/bolean-utils-hugo.git bolean-utils`

2. Configure `hugo` to use the theme.
   Add this line near the top of `config.toml`:
   `theme = ["bolean-utils"]`


# FIRST PULL

The first time you pull/clone a repo, you will need to follow up the 
checkout with: `git submodule update --init` to pull the required submodules.

Unless you need to update the version used at a later time, you will not have
to do this again.


# FEATURES

`TODO: Describe partials and what they do.`


# AUTHOR

Brian Edmonds `<bedmonds@bolean.ca>`, for bolēan


[Hugo]: https://gohugo.io/
