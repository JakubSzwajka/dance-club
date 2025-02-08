from ninja import Schema


class InstructorStatsSchema(Schema):
    total_classes: int
    total_students: int
    average_capacity: float
