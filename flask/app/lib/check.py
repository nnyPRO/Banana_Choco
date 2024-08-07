# Written By Auttakorn Camsoi
# function for checking key in 
def checkDictKey(data, keylist):
    if len(data.keys()) != len(keylist):
        return False
    for key in keylist:
        if key not in data:
            return False
    return True

# Written By Auttakorn Camsoi
# function for checking key in
def checkListDictKey(data, keylist):
    for i in data:
        if not checkDictKey(i, keylist):
            return False
    return True