# pythom lib
from re import compile

# email err
EMAIL_ERR = "EMAIL_INVALID"
EMAIL_NOT_FOUND = "EMAIL_NFOUND"
EMAIL_ALREADY = "EMAIL_ALREADY"

# username err
USERNAME_LEN = "NAME_LEN"
USERNAME_INVALID = "NAME_INVALID"

# password
PASS_LEN = "PASS_LEN"
PASS_NOT_EQUAL = "PASS_NEQUAL"
PASS_WRONG = "PASS_WRONG"

# request
BODY_NOT_CORRECT = "BODY_NCORRECT"

# file
FILE_SIZE = "FILE_SIZE"

def emailValidate(email:str)->bool:
    '''Function for email validate'''
    if email.count("@") != 1 or email[-1]=="@":
        return False
    try:
        back = email.split("@")[1]
    except:
        return False
    if back.count(".") == 0 or back[-1] == ".":
        return False
    return True

def lengthCheck(_input:str)->bool:
    '''Function for check length'''
    if len(_input)<8 or len(_input)>20:
        return False
    return True

def formatNumAndChar(_input:str)->bool:
    reg = compile(r'\d')
    return not (_input.isnumeric() or not reg.search(_input)) 