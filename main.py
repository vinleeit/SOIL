result = []
numbers = [5,7,9,13,11,6,6,3,3]
target = 12


half = target / 2
if (half % 2 == 0):
    a = False
    b = False
    for number in numbers:
        if number == half:
            if a == False:
                a = True
            else:
                b = True
        if a and b:
            break

    if a and b:
        half = int(half)
        result.append((half, half))
        numbers = list(set(numbers))
        numbers.remove(half)

i = 0
while i != len(numbers) - 2:
    curNumber = numbers[i]
    remaining = target - curNumber
    for j in range(i + 1, len(numbers) - 1):
        if numbers[j] == remaining:
            del numbers[j]
            result.append((curNumber, remaining))
    i+=1

print(result)

