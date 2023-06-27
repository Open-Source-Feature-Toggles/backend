# TODO


1. Combine Validation Input and put into its own module for every controller 
2. Take the line let errors = ValidationResult(req) and put it into a function. Replace all of the 
controllers that currently use this with that function 
3. Figure out how to rearrange verifyTokenFindUser middleware with all middleware that needs to verify a token and find a user 