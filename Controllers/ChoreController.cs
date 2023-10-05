using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HouseRules.Data;
using HouseRules.Models;
using Microsoft.EntityFrameworkCore;

namespace HouseRules.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChoreController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public ChoreController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]  // route /api/chore
    //[Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext.Chores.ToList());
    }

    [HttpGet("{id}")] // route /api/chore/{id}
    //[Authorize] 
    public IActionResult GetChoreById(int id)
    {
        Chore chore = _dbContext.Chores
        .Include(c => c.ChoreAssignments)
            .ThenInclude(ca => ca.UserProfile)
        .Include(c => c.ChoreCompletions)

        .SingleOrDefault(c => c.Id == id);

        if (chore == null)
        {
            return NotFound();
        }

        // Remove UserProfile information from ChoreCompletions
        // based on the requirement
        foreach (var completion in chore.ChoreCompletions)
        {
            completion.UserProfile = null;
        }

        // Remove ChoreCompletions information from its current assignees' UserProfile 
        // to avoid unnecessarily long JSON returns; and unnecessary information
        foreach (var assignment in chore.ChoreAssignments)
        {
            assignment.UserProfile.ChoreCompletions = null;
        }

        return Ok(chore);
    }
}

