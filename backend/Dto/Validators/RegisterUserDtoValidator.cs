using family_tree_API.Models;
using FluentValidation;

namespace family_tree_API.Dto.Validators
{
    public class RegisterUserDtoValidator : AbstractValidator<RegisterUserDto>
    {
        public RegisterUserDtoValidator(FamilyTreeContext dbContext)
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .MinimumLength(6);

            RuleFor(x => x.Name)
                .NotEmpty();

            RuleFor(x => x.Email) //validation for not making the same e-mail
                .Custom((value, context) =>
                    {
                        var emailInUse = dbContext.Users.Any(u => u.EMail == value);
                        if (emailInUse)
                        {
                            context.AddFailure("Email", "That email is taken");
                        }
                    }
                );
        }
    }
}
