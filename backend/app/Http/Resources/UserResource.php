<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'phone' => $this->phone,
            'nama_lengkap' => $this->nama_lengkap,
            'nama_panggilan' => $this->nama_panggilan,
            'foto_profil_url' => $this->foto_profil_url,
            'tingkatan' => new TingkatanResource($this->whenLoaded('tingkatan')),
            'role' => $this->role,
            'is_verified' => $this->is_verified,
            'profile' => new ProfileResource($this->whenLoaded('profile')),
            'badges' => UserBadgeResource::collection($this->whenLoaded('badges')),
            'kta' => KTADocumentResource::collection($this->whenLoaded('kta')),
            'certificates' => CertificateResource::collection($this->whenLoaded('certificates')),
            'materi_progress' => $this->whenLoaded('materiProgress'),
            'created_at' => $this->created_at,
        ];
    }
}
