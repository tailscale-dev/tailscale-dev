# tailscale.dev

This site is powered by [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) and [ContentLayer](https://www.contentlayer.dev/).

## Local Development

**Quick start**

Running `tool/yarn install` will install all required dependencies. Once complete, use `tool/yarn dev` to start the development server which defaults to port `3000`.

**Development tools**

Following the [Tailscale OSS](https://github.com/tailscale/tailscale) repository, we use a `./tool` directory to manage tool dependencies. Versions are pinned via `*.rev` files in the projects' root and installed via `./tool/redo.sh` using the `*.cmd.do` files also in the project's root.

Flakes are provided for Nix users, with `nix develop` for the environment.

The following tools are available:

- `./tool/node` - [Node](https://nodejs.org/) for future JavaScript tooling
- `./tool/yarn` - [Yarn](https://yarnpkg.com/) package manager
- `./tool/redo.sh` - [Redo](https://github.com/apenwarr/redo) build/automation tool (for deps)

If available, [direnv](https://direnv.net/) will place these tools in your PATH per our `.envrc` config. Installation instructions for direnv are available [here](https://direnv.net/docs/installation.html).

**Code formatting**

If you're using VSCode, the project includes a `.vscode/` directory with a `settings.json` file that will automatically format your code on save. We also have the Prettier as a recommended extension in the `extensions.json` file.

A pre-commit hook is added when you run `yarn` for the first time which will ensure ESLint and Prettier are run on the staged files and will apply fixes automatically.

## Posts

All blog posts and events are stored as [MDX](https://mdxjs.com) files under the `data` directory. MDX can be treated like traditional Markdown, with the benefit that it supports JSX, JavaScript expressions, and ESM import and export statements.

Markdown is of the Github style, which is documented [here](https://docs.github.com/get-started/writing-on-github).

## Blog Post

Blog posts are located under `data/blog` with the following front matter:

- **title\*** (string)
- **date\*** (string, ANSI date)
- **summary\*** (string)
- **tags** (array)
- **lastmod** (string, ANSI date)
- **authors** (array): if not specified will use the "default" author (`data/authors/default.mdx`)
- **layout** (string)

**\*** denotes required properties

## Events

Events are located under `data/events` with the following front matter:

- **title\*** (string)
- **date\*** (string, ANSI date)
- **location\*** (string)
- **summary\*** (string)
- **endsDate** (string, ANSI date): last day of the event, defaults to **date**
- **displayDate** (string)
- **displayTime** (string)
- **link** (string)
- **authors** (array): if not specified will use the "default" author (`data/authors/default.mdx`)
- **layout** (string)

**\*** denotes required properties

## Authors

Authors are located under `data/authors` with the following front matter:

- **name\*** (string)
- **avatar\*** (string)
- **handle** (string)
- **tailscalar** (boolean)
- **twitter** (string)
- **linkedin** (string)
- **github** (string)
- **website** (string)
- **fediverse** (string)
- **layout** (string)

**\*** denotes required properties

## JSX Components

Components are made available globally by defining them in the [ComponentMap](components/MDXComponents.tsx).

The following JSX components are available to all content types:

### `<Image />`

Extends [next/image](https://nextjs.org/docs/api-reference/next/image). Only required properties of next/image listed here, for additional options, reference the next/image documentation.

| property (\* required) | type    | default | description                                                    |
| ---------------------- | ------- | ------- | -------------------------------------------------------------- |
| src\*                  | string  |         | path of the image                                              |
| width\*                | string  |         | rendered width in pixels                                       |
| height\*               | string  |         | rendered height in pixels                                      |
| alt\*                  | string  |         | description of the image for screen readers and search engines |
| showCaption            | boolean | false   | displays the alt text below the image                          |
| href                   | string  |         | URL or path to navicate to                                     |

### `<HeroImage />`

| property (\* required) | type   | default | description                                                     |
| ---------------------- | ------ | ------- | --------------------------------------------------------------- |
| src\*                  | string |         | path of the image                                               |
| desc\*                 | string |         | description of the image or the prompt used if `generator=true` |
| width\*                | string |         | rendered width in pixels                                        |
| height\*               | string |         | rendered height in pixels                                       |
| generator              | string | false   | what was used to create the image                               |

### `<ConvSnippet />`

| property (\* required) | type      | default | description                       |
| ---------------------- | --------- | ------- | --------------------------------- |
| authors\*              | array     |         | list of authors `{props.authors}` |
| name\*                 | string    |         | name of the author                |
| children\*             | ReactNode |         |                                   |

### `<TOCInline />`

Generates an inline table of contents

| property (\* required) | type          | default | description   |
| ---------------------- | ------------- | ------- | ------------- |
| toc\*                  | array         |         | `{props.toc}` |
| indentDepth            | number        | 3       |               |
| fromHeading            | number        | 1       |               |
| toHeading              | number        | 6       |               |
| asDisclosure           | boolean       | false   |               |
| exclude                | string\|array |         |               |

### `<NewsletterRepublishing />`

Displays a notice of a partial re-publishing from our monthly newsletter and provides a link to signup for future newsletters.
