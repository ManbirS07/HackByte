import { useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CAUSES, SKILLS, SearchFilters } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';

interface EventSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

const EventSearch = ({ onSearch }: EventSearchProps) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Search form submitted with:", {
      keyword,
      location,
      causes: selectedCauses,
      skills: selectedSkills,
      date
    });
    
    const filters: SearchFilters = {};
    
    if (keyword.trim()) {
      // Add keyword handling if needed
    }
    
    if (location.trim()) {
      filters.location = location;
    }
    
    if (selectedCauses.length > 0) {
      filters.causes = selectedCauses;
    }
    
    if (selectedSkills.length > 0) {
      filters.skills = selectedSkills;
    }
    
    if (date) {
      filters.date = new Date(date); // Convert string date to Date object
    }
    
    console.log("Passing filters to parent:", filters);
    onSearch(filters);
  };

  const handleCauseToggle = (cause: string) => {
    setSelectedCauses(prev =>
      prev.includes(cause)
        ? prev.filter(c => c !== cause)
        : [...prev, cause]
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setSelectedCauses([]);
    setSelectedSkills([]);
    setDate('');
    console.log("Resetting filters");
    onSearch({});
  };

  return (
    <div className="w-full bg-white border rounded-lg shadow-sm p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow flex gap-2 items-center border rounded-md px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for volunteer opportunities..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-grow border-none shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 items-center border rounded-md px-3 py-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="flex gap-2 items-center border rounded-md px-3 py-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" type="button">
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Events</SheetTitle>
                  <SheetDescription>
                    Refine your search with specific filters
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-medium">Causes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {CAUSES.map((cause) => (
                        <div key={cause} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cause-${cause}`}
                            checked={selectedCauses.includes(cause)}
                            onCheckedChange={() => handleCauseToggle(cause)}
                          />
                          <label
                            htmlFor={`cause-${cause}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {cause}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Required Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {SKILLS.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <label
                            htmlFor={`skill-${skill}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <Button variant="outline" type="button" onClick={handleReset}>
                      Reset Filters
                    </Button>
                    <Button type="submit" onClick={handleSubmit}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button type="submit">Search</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventSearch;
