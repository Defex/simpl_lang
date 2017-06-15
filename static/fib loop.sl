{
	fun fib(z) {
		x = 2
		f1 = 0
		f2 = 1
		f3 = f1 + f2
		while {x<z} {
			f1 = f2
			f2 = f3
			f3 = f1 + f2
			x = x + 1
		}
		if{z < 2} {
			f3 = z
		}
		f3
	}
	fib(20)
}