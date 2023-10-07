# Counter

Super light counter API powered by Hono and Deno.

- Data is stored in Deno KV.
- Easy setup with Deno Deploy or self-hosted.

## Usage

Get count with a `key`:

```bash
$ curl https://cnt.deno.dev/get/key
# -> {"data":1024}
```

Increment count with a `key`:

```bash
$ curl https://cnt.deno.dev/hit/key
# -> {}
```
