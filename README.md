# Counter

Super light counter API powered by Hono and Deno.

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
