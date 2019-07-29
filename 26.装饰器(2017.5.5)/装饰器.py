import functools


def log(functext):
    if isinstance(functext, str):
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kw):
                print('%s %s' % (functext, func.__name__))
                return func(*args, **kw)
            return wrapper
        return decorator
    else:
        @functools.wraps(functext)
        def wrapper(*args, **kw):
            print('call %s:' % functext.__name__)
            return functext(*args, **kw)
        return wrapper


@log
def now1():
    print('2011-11-11')


@log('This is')
def now2():
    print('2022-22-22')

now1()
print(now1.__name__)
now2()
print(now2.__name__)
