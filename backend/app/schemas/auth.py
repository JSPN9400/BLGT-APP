from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    business_name: str
    business_type: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    business_name: str
    business_type: str
    company_logo_url: str | None
    current_plan: str

    model_config = {"from_attributes": True}
