# Habrasanta frontend

Ported from the legacy, over 10 years old, version!

## Starting locally

```bash
$ npm install
$ npm start
```

By default, the beta backend (https://beta.habrasanta.org) is used.

## Making production build

```bash
$ NODE_ENV=production npm run build
```

## Deployment

Deployment is completely automated thanks to GitHub Actions.

When a pull request is open, a new website is automatically created at `pull-request-#num.habrasanta.org` and your changes are deployed there.

Once the pull request is merged into `main`, a bit more complicated workflow happens:

![](https://habrastorage.org/webt/ue/aa/hl/ueaahlwgjg24ox0mmdx-qcqft28.png)

- The website is deployed on https://beta.habrasanta.org first.
- @Inzeppelin makes a final review and presses the big shinny OK button on GitHub.
- The website is finally deployed on https://habra-adm.ru and starts making out users happy.

See also the latest deployments in the sidebar on the right 👉
