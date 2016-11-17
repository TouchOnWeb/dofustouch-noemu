Set objArgs = WScript.Arguments
Set UAC = CreateObject("Shell.Application")
UAC.ShellExecute objArgs(0) & "\update.bat", objArgs(0) & " " & objArgs(1), "", "runas", 1
