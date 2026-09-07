import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Eye, Trash2 } from "lucide-react";


export default function PrescriptionCard({
  date,
  medication,
  language,
  doctor,
  status,
  onView,
  onDelete,
}) {


  return (

    <Card className="rounded-xl p-4">


      <p className="text-sm text-muted-foreground">
        {date}
      </p>


      <h3 className="mt-2 font-semibold">
        {medication}
      </h3>


      <div className="mt-3 space-y-1">

        <p className="text-sm">
          Doctor: {doctor}
        </p>


        <Badge>
          {language}
        </Badge>

      </div>



      <div className="mt-3 flex gap-2">

        {
          status.map((item)=>(
            <Badge 
              key={item}
              variant="secondary"
            >
              {item}
            </Badge>
          ))
        }

      </div>



      <div className="mt-4 flex gap-3">


        <Button onClick={onView}>

          <Eye className="mr-2 h-4 w-4"/>

          View

        </Button>



        <Button
          variant="destructive"
          onClick={onDelete}
        >

          <Trash2 className="mr-2 h-4 w-4"/>

          Delete

        </Button>


      </div>


    </Card>

  );

}