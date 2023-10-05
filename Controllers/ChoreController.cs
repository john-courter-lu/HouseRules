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

    // get all chores
    [HttpGet]  // route /api/chore
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext.Chores.ToList());
    }

    // get chores by id with selective info
    [HttpGet("{id}")] // route /api/chore/{id}
    [Authorize] 
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

    // complete a chore
    [HttpPost("{id}/complete")]
    [Authorize]
    public IActionResult CompleteChore(int id, int userId)
    {
        Chore choreToComplete = _dbContext.Chores
        .SingleOrDefault(c => c.Id == id);

        if (choreToComplete == null)
        {
            return NotFound();
        }

        // to improve: algorithm of checking if userId exists
        UserProfile user = _dbContext.UserProfiles
        .SingleOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return BadRequest("Invalid userId."); //400 
        }

        // Check if the chore is already completed by the user
        bool isCompleted = _dbContext.ChoreCompletions
            .Any(cc => cc.ChoreId == id && cc.UserProfileId == userId && cc.CompletedOn == DateTime.Today);

        if (isCompleted)
        {
            return BadRequest("Chore is already completed by the user today."); //400
        }

        _dbContext.ChoreCompletions.Add(new ChoreCompletion
        {
            UserProfileId = userId,
            ChoreId = id,
            CompletedOn = DateTime.Today
        });

        _dbContext.SaveChanges();

        return NoContent();
    }
}

