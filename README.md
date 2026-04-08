# mermaid-to-png

Export Mermaid diagrams to PNG directly from VS Code using the `mmdc` (Mermaid CLI) engine.

## Features

- Export `.mmd` files to PNG via Explorer or Editor context menu
- Export selected Mermaid code from any editor to PNG
- Export all Mermaid code blocks in a Markdown file to individual PNGs
- Configurable theme, background color, image scale, and output directory
- Strips markdown code fences automatically when exporting selections

## Requirements

[Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) must be installed and accessible.

**Recommended: install globally**

```sh
npm install -g @mermaid-js/mermaid-cli
```

Keep the default setting `mermaid-to-png.mmdcPath = "mmdc"`.

**Alternative: use a custom path**

Set `mermaid-to-png.mmdcPath` to any command string, for example `npx mmdc` or `/usr/local/bin/mmdc`.

## Installation

Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/) or side-load the `.vsix` package:

```sh
code --install-extension mermaid-to-png-*.vsix --force
```

## Usage

### Export a `.mmd` file

Right-click a `.mmd` file in the Explorer or Editor and choose **Mermaid: Export Mermaid Diagrams to PNG**. The PNG is saved beside the source file by default.

### Export selected Mermaid code

1. Select Mermaid diagram text in any editor
2. Right-click and choose **Mermaid: Export Mermaid Diagrams to PNG**

Code fences (` ```mermaid ... ``` `) are stripped automatically.

### Export a Markdown file

Right-click a `.md` file in the Explorer and choose **Mermaid: Export Mermaid Diagrams to PNG**. Each ` ```mermaid ` code block is exported to its own PNG file.

## Configuration

Open VS Code Settings and search for `mermaid-to-png`.

| Setting | Type | Default | Description |
|---|---|---|---|
| `mermaid-to-png.mmdcPath` | `string` | `mmdc` | Path or command for the mmdc executable |
| `mermaid-to-png.outputDir` | `string` | `""` | Output directory. Empty = beside source file |
| `mermaid-to-png.theme` | `string` | `default` | Theme: `default`, `dark`, `forest`, `neutral` |
| `mermaid-to-png.background` | `string` | `white` | Background color (e.g. `white`, `transparent`, `#ffffff`) |
| `mermaid-to-png.scale` | `number` | `2` | Image scale multiplier (1–8). Higher = sharper but larger |

### Image clarity guide

| Use case | Recommended scale |
|---|---|
| UI docs / screenshots | `2` |
| Presentation slides | `3` |
| Print assets | `4` |

## Troubleshooting

**"Cannot find mmdc executable"**

Ensure `@mermaid-js/mermaid-cli` is installed globally and `mermaid-to-png.mmdcPath` points to the correct command.

**Export fails with Mermaid syntax errors**

Validate the source syntax by rendering via CLI directly:

```sh
mmdc -i input.mmd -o output.png
```

**PNG not generated where expected**

If `mermaid-to-png.outputDir` is a relative path, it resolves from the source file's directory.

## Development

```sh
# Install dependencies
pnpm install

# Compile TypeScript
pnpm run compile

# Run in Extension Development Host (F5)
pnpm run watch

# Package .vsix
pnpm run package
```

## License

MIT


### Export file mode
- `diagram.mmd` -> `diagram.png`

### Export selection mode
- If source doc is file-backed: use source file base name
- If target name already exists: append suffix `_1`, `_2`, ...
- For untitled/virtual docs: fallback to `diagram.png` in home directory (or configured output dir)

## Commands

- `mermaid-to-png.exportFile`
  - Title: **Mermaid: Export Mermaid Diagrams to PNG**
  - Context: `.mmd` file in explorer/editor context

- `mermaid-to-png.exportSelection`
  - Title: **Mermaid: Export Mermaid Diagrams to PNG**
  - Context: any editor with non-empty selection

## Troubleshooting

### "Cannot find mmdc executable"
- Install Mermaid CLI globally:

```bash
npm install -g @mermaid-js/mermaid-cli
```

- Or set correct `mermaid-to-png.mmdcPath`

### Export fails with Mermaid syntax errors
- Validate Mermaid source syntax first
- Try rendering the same file via CLI to inspect full error:

```bash
mmdc -i input.mmd -o output.png
```

### PNG not generated where expected
- Check `mermaid-to-png.outputDir`
- If relative path is used, it resolves from source file directory

## Development

### Install dependencies

```bash
pnpm install
```

### Compile

```bash
pnpm run compile
```

### Run extension in development
- Open this project in VS Code
- Press `F5` to launch Extension Development Host

### Package

```bash
pnpm run package
```

## License

MIT
