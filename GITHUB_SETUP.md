# GitHub Setup

The repo is initialized and committed locally. To push to GitHub:

## 1. Log in to GitHub (one-time)

```powershell
gh auth login
```

Follow the prompts (browser or token).

## 2. Create the private repo and push

```powershell
cd c:\GitRepos\RiseOfCivilization
gh repo create rise-of-civilization --private --source=. --remote=origin --push
```

This creates `rise-of-civilization` as a private repo and pushes your local `master` branch.

---

**If your GitHub username is not `omri96david`**, update the remote first:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/rise-of-civilization.git
```

Then run the `gh repo create` command above.
