**Only works on Windows!**


# Quick start

**This tool requires the WoW client to be in foreground. If you ever cover up the client in any way it might trigger the alarm, as we're not looking if your logged in, but if you are not logged in!**

1. **Install via npm**

```
npm install -g wow-login-alert
```

2. Setup folder

Create an empty folder on your harddrive and open a CMD inside the folder

(Can use Shift + Right click > Open CMD/PowerShell in Explorer)

```
E:\path\to\folder>
```

3. Setup baseline picture

Run the find-display command. It will take a screenshot of each of your displays and put them inside your folder.

```
E:\path\to\folder>wow-login-alert find-display
```

They will be numbered, like 0-ref.png, 1-ref.png... etc. The number is the ID of that display.

Go trough the pictures and find the one that contains your WoW client and the queue screen. **Remember the ID**

4. Dry run (optional)

You can verify if the tool considers this a queue page or not by running

```
wow-login-alert test <Display ID>
```

It will either sound the alarm or just indicate that the screen is a queue screen

5. Run the tool

Running the tool will check the WoW screen every 3rd minute if the queue is popped. If it is, it will sound the alarm until your turn off the program (CTRL + C)

```
wow-login-alert go <Display ID>
```