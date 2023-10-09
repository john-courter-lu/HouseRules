using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models;

public class Chore
{
    public int Id { get; set; }
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Chore name must be between 3-100 characters")]
    [Required]
    public string Name { get; set; }
    [Range(1, 5, ErrorMessage = "Difficulty value must be between 1-5")]
    public int Difficulty { get; set; }
    public int ChoreFrequencyDays { get; set; }
    public List<ChoreAssignment>? ChoreAssignments { get; set; }
    public List<ChoreCompletion>? ChoreCompletions { get; set; }

}

/* json body to test for data validation
{

  "name": "Do",
  "difficulty": 7,
  "choreFrequencyDays": 3

  }

 */