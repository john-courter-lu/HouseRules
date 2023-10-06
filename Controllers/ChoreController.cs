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
        // For front-end, decided to keep the information
        
        // foreach (var completion in chore.ChoreCompletions)
        // {
        //     completion.UserProfile = null;
        // }

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

    // below are admin only
    // post a new chore
    [HttpPost] // /api/chore/
    [Authorize(Roles = "Admin")]
    public IActionResult CreateChore([FromBody] Chore chore)
    {
        // add request validation
        if (chore == null)
        {
            return BadRequest("Invalid chore data.");
        }

        // Further validation to check if a chore with the same name already exists
        var existingChore = _dbContext.Chores.FirstOrDefault(c => c.Name == chore.Name);
        if (existingChore != null)
        {
            return BadRequest("A chore with the same name already exists.");
        }

        // Consider Using ViewModel: Depending on your application's requirements, it's often a good practice to use a view model or DTO (Data Transfer Object) to receive and return data instead of directly using your domain model (in this case, Chore). 
        // It helps make sure the JSON body is the object you expect

        // Error Handling
        try
        {
            _dbContext.Chores.Add(chore);
            _dbContext.SaveChanges();

            return Created($"/api/chore/{chore.Id}", chore);
        }
        catch (Exception ex)
        {
            // Log the exception and return an appropriate error response.
            return StatusCode(500, "An error occurred while creating the chore.");
        }
    }

    // admins only, update a chore
    // This endpoint should allow updating all of the columns of the Chore table 
    [HttpPut("{id}")] // /api/chore/{id}
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateChore(int id, [FromBody] Chore updatedChore)
    {
        Chore chore = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        if (chore == null)
        {
            return NotFound();
        }
        else if (chore.Id != updatedChore.Id)
        {
            return BadRequest("updatedChore has the wrong Id");
        }

        chore.Name = updatedChore.Name;
        chore.Difficulty = updatedChore.Difficulty;
        chore.ChoreFrequencyDays = updatedChore.ChoreFrequencyDays;
        // chore.ChoreAssignments = updatedChore.ChoreAssignments;
        // chore.ChoreCompletions = updatedChore.ChoreCompletions;

        _dbContext.SaveChanges();

        return NoContent();
    }

    // admins only, delete a chore
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteChore(int id)
    {
        Chore choreToDelete = _dbContext.Chores.SingleOrDefault(c => c.Id == id);

        if (choreToDelete == null)
        {
            return NotFound();
        }

        _dbContext.Chores.Remove(choreToDelete);
        _dbContext.SaveChanges();
        return NoContent();
    }

    // admins only, assign a chore to a user
    [HttpPost("{id}/assign")]
    //[Authorize(Roles = "Admin")] 
    public IActionResult AssignChore(int id, int userId)
    {
        Chore choreToAssign = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        UserProfile userProfile = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == userId);

        if (choreToAssign == null || userProfile == null)
        {
            return NotFound("Chore or User doesn't exist.");
        }

        _dbContext.ChoreAssignments.Add(new ChoreAssignment
        {
            UserProfileId = userId,
            ChoreId = id
        });

        _dbContext.SaveChanges();

        return NoContent();
    }

    // admins only, assign a chore to a user
    [HttpPost("{id}/unassign")]
    [Authorize(Roles = "Admin")]
    public IActionResult UnssignChore(int id, int userId)
    {
        Chore choreToUnassign = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        UserProfile userProfile = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == userId);
        ChoreAssignment choreAssignment = _dbContext.ChoreAssignments.SingleOrDefault(ca => ca.ChoreId == id && ca.UserProfileId == userId);

        if (choreToUnassign == null || userProfile == null || choreAssignment == null)
        {
            return NotFound("chore or user or assignment not found");
        }

        _dbContext.ChoreAssignments.Remove(choreAssignment);
        _dbContext.SaveChanges();

        return NoContent();
    }


}

