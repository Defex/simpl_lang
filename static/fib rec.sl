{
	fun fib(z){
		if{z<2}{
			z
		}else{
			fib(z-1)+fib(z-2)
		}
	}
	fib(20)
}