# Counter

Super light counter API powered by Hono and Deno.

- Data is stored in Deno KV.
- Easy setup with Deno Deploy or self-hosted.

## Usage

Get count with keys:

```bash
$ curl https://cnt.deno.dev/get/key1,key2
# -> {"data":{"key1":1024,"key2":0}}
```

Increment count with a `key`:

```bash
$ curl https://cnt.deno.dev/hit/key
# -> {}
```
