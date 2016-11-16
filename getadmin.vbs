Set UAC = CreateObject("Shell.Application")
Set objArgs = WScript.Arguments
UAC.ShellExecute objArgs(0) & "\update.bat", objArgs(0) & " " & objArgs(1), "", "runas", 1
