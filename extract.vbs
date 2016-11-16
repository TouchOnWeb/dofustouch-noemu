Set FSCopie = CreateObject("Scripting.FileSystemObject") 
Set Fichier = FSCopie.GetFile("update.zip")
DossierZip=Fichier.ParentFolder & "\update.zip"
DossierDezip = Fichier.ParentFolder    
Set osa = CreateObject("Shell.Application" )
' Nombre de fichiers à extraire 
    nbFic = osa.Namespace(DossierZip).Items.Count 
' Décompression des fichiers 
    osa.Namespace(DossierDezip).CopyHere osa.Namespace(DossierZip).Items 
    Set osa = Nothing